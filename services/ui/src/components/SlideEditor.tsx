import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Editor from "@monaco-editor/react";
import * as esbuild from "esbuild-wasm";
import { useEsbuild } from "../hooks/useEsbuild";
import { Stage } from "./Stage";

type CompileState = "idle" | "compiling" | "ready" | "error";

type SlideEditorProps = {
  initialCode: string;
  wasmURL?: string;
  slideTitle?: string;
  initialSpeakerNotes: string;
};

export function SlideEditor({
  initialCode,
  wasmURL,
  slideTitle = "Rendered Slide",
  initialSpeakerNotes,
}: SlideEditorProps) {
  const { ensureEsbuild } = useEsbuild(wasmURL);
  const [code, setCode] = useState(initialCode);
  const [speakerNotes, setSpeakerNotes] = useState<string>(
    initialSpeakerNotes
  );
  const [state, setState] = useState<CompileState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [CompiledComponent, setCompiledComponent] =
    useState<React.ComponentType | null>(null);
  const compileCounter = useRef(0);
  const [sidebarWidth, setSidebarWidth] = useState<number>(45);
  const [editorShare, setEditorShare] = useState<number>(65);
  const [activeTab, setActiveTab] = useState<"slide" | "notes">("slide");
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    setSpeakerNotes(initialSpeakerNotes);
  }, [initialSpeakerNotes]);

  useEffect(() => {
    let cancelled = false;
    const trimmed = code.trim();

    if (!trimmed) {
      setState("idle");
      setErrorMessage(null);
      setCompiledComponent(null);
      return;
    }

    const taskId = ++compileCounter.current;
    setState("compiling");
    setErrorMessage(null);

    const debounce = window.setTimeout(async () => {
      try {
        await ensureEsbuild();

        const result = await esbuild.transform(code, {
          loader: "jsx",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment",
          format: "cjs",
          target: "es2018",
        });

        if (cancelled || taskId !== compileCounter.current) {
          return;
        }

        const module = { exports: {} as Record<string, unknown> };
        const fn = new Function("React", "exports", "module", result.code);
        fn(React, module.exports, module);

        const Component = module.exports.default;
        if (typeof Component !== "function") {
          throw new Error(
            "Expected the snippet to default-export a React component."
          );
        }

        setCompiledComponent(() => Component as React.ComponentType);
        setState("ready");
      } catch (error) {
        if (cancelled || taskId !== compileCounter.current) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : String(error));
        setCompiledComponent(null);
        setState("error");
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(debounce);
    };
  }, [code, ensureEsbuild]);

  const statusLabel = useMemo(() => {
    switch (state) {
      case "compiling":
        return "Compiling…";
      case "ready":
        return "Live";
      case "error":
        return "Error";
      default:
        return "Idle";
    }
  }, [state]);

  const statusTone = useMemo(() => {
    switch (state) {
      case "ready":
        return "bg-emerald-500/20 text-emerald-200";
      case "compiling":
        return "bg-cyan-500/20 text-cyan-200 animate-pulse";
      case "error":
        return "bg-rose-500/20 text-rose-200";
      default:
        return "bg-slate-700/40 text-slate-300";
    }
  }, [state]);

  const beginHorizontalResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const startX = event.clientX;
      const startWidthPx = (sidebarWidth / 100) * rect.width;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = "none";

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextPx = startWidthPx + delta;
        let nextPercent = (nextPx / rect.width) * 100;
        nextPercent = Math.max(25, Math.min(75, nextPercent));
        setSidebarWidth(nextPercent);
      };

      const handlePointerUp = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [sidebarWidth]
  );

  const beginVerticalResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const sidebar = sidebarRef.current;
      if (!sidebar) {
        return;
      }

      const rect = sidebar.getBoundingClientRect();
      const startY = event.clientY;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = "none";
      const startShare = editorShare;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientY - startY;
        let nextShare = startShare + (delta / rect.height) * 100;
        nextShare = Math.max(30, Math.min(85, nextShare));
        setEditorShare(nextShare);
      };

      const handlePointerUp = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [editorShare]
  );

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full gap-6 overflow-hidden bg-slate-950 p-6"
    >
      <div
        ref={sidebarRef}
        style={{ flexBasis: `${sidebarWidth}%`, width: `${sidebarWidth}%` }}
        className="flex h-full min-w-[260px] max-w-full flex-shrink-0 flex-col gap-4 overflow-hidden"
      >
        <div
          style={{ flexGrow: editorShare, flexBasis: 0 }}
          className="flex min-h-[220px] flex-col overflow-hidden border border-slate-800 bg-slate-950/40 p-4"
        >
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-400">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("slide")}
                className={`px-3 py-1 text-[10px] font-semibold ${
                  activeTab === "slide"
                    ? "bg-slate-800 text-slate-100"
                    : "bg-transparent text-slate-500 hover:text-slate-200"
                }`}
              >
                Slide JSX
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`px-3 py-1 text-[10px] font-semibold ${
                  activeTab === "notes"
                    ? "bg-slate-800 text-slate-100"
                    : "bg-transparent text-slate-500 hover:text-slate-200"
                }`}
              >
                Speaker Notes
              </button>
            </div>
            {activeTab === "slide" ? (
              <span
                className={`rounded px-2 py-1 text-[10px] font-medium ${statusTone}`}
              >
                {statusLabel}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-500">
                markdown
              </span>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden border border-slate-800">
            {activeTab === "slide" ? (
              <Editor
                language="javascript"
                value={code}
                onChange={(value) => setCode(value ?? "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily:
                    "IBM Plex Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
                  smoothScrolling: true,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                  },
                }}
                height="100%"
                width="100%"
              />
            ) : (
              <Editor
                language="markdown"
                value={speakerNotes}
                onChange={(value) => setSpeakerNotes(value ?? "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily:
                    "IBM Plex Mono, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
                  smoothScrolling: true,
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                  },
                }}
                height="100%"
                width="100%"
              />
            )}
          </div>
        </div>

        <div
          onPointerDown={beginVerticalResize}
          className="flex h-4 cursor-row-resize items-center justify-center"
        >
          <div className="h-px w-16 bg-slate-700" />
        </div>

        <div
          style={{ flexGrow: 100 - editorShare, flexBasis: 0 }}
          className="flex min-h-[140px] flex-col overflow-hidden border border-slate-800 bg-slate-950/40 p-4"
        >
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Copilot (mock)
          </div>
          <div className="flex flex-1 flex-col gap-3 text-xs text-slate-200">
            <div className="flex gap-3 border border-slate-800/80 bg-slate-950/50 p-3">
              <div className="mt-0.5 h-7 w-7 flex-none rounded-full bg-cyan-500/30" />
              <div>
                <p className="font-semibold text-slate-100">Copilot</p>
                <p>
                  Ask for layout tweaks, speaker notes, or design inspiration.
                  Copilot returns JSX snippets that slot into your slide
                  instantly.
                </p>
              </div>
            </div>
            <div className="ml-auto max-w-xs border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-cyan-100">
              “Summarize this slide in one sentence for an executive audience.”
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 border border-slate-800/80 bg-slate-950/40 px-3 py-2 text-[11px] text-slate-400">
              <span>New prompt…</span>
              <button className="rounded bg-cyan-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-500/30">
                Open chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        onPointerDown={beginHorizontalResize}
        className="flex w-4 cursor-col-resize items-center justify-center"
      >
        <div className="h-16 w-px bg-slate-700" />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border border-slate-800 bg-slate-950/40 p-4">
        <div className="mb-3 text-sm font-semibold text-slate-200">
          {slideTitle}
        </div>
        <div className="flex flex-1 overflow-auto">
          <Stage className="items-center justify-center">
            {state === "compiling" && (
              <span className="text-sm text-slate-400">Compiling…</span>
            )}

            {state === "error" && (
              <div className="max-w-sm border border-rose-500/50 bg-rose-500/10 p-5 text-sm text-rose-100">
                <p className="font-medium text-rose-100">Compilation failed</p>
                <p className="mt-2 whitespace-pre-wrap break-words">
                  {errorMessage}
                </p>
              </div>
            )}

            {state === "ready" && CompiledComponent && <CompiledComponent />}

            {state === "idle" && (
              <span className="text-sm text-slate-400">
                Start typing to see your slide here.
              </span>
            )}
          </Stage>
        </div>
      </div>
    </div>
  );
}
