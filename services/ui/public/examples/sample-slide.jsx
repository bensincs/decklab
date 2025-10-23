export default function SampleSlide() {
  return (
    <div className="relative flex min-h-full w-full flex-col overflow-hidden border border-slate-800 bg-slate-950/50 p-12 text-left md:p-16">
      <style>
        {`
        @keyframes orbit {
          0% { transform: translate(-20%, -20%) rotate(0deg); }
          50% { transform: translate(10%, 5%) rotate(180deg); }
          100% { transform: translate(-20%, -20%) rotate(360deg); }
        }
        @keyframes orbitReverse {
          0% { transform: translate(35%, 20%) rotate(0deg); }
          50% { transform: translate(10%, 40%) rotate(-180deg); }
          100% { transform: translate(35%, 20%) rotate(-360deg); }
        }
        @keyframes shimmer {
          0% { opacity: 0.25; transform: translateY(0px); }
          50% { opacity: 0.55; transform: translateY(-8px); }
          100% { opacity: 0.25; transform: translateY(0px); }
        }
      `}
      </style>

      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-24 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[140px]"
        style={{ animation: "orbit 26s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 left-0 h-[520px] w-[520px] rounded-full bg-fuchsia-500/12 blur-[160px]"
        style={{ animation: "orbitReverse 32s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(45, 212, 191, 0.22), transparent 55%), radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.16), transparent 60%)",
        }}
      />

      <header className="relative z-10 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.36em] text-cyan-200/90">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
            DeckLab Motion
          </span>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Design <span className="text-cyan-300">immersive decks</span> with real-time, stage-perfect previews
          </h1>
          <p className="text-base text-slate-200/90">
            Every edit compiles instantly inside the DeckLab Stage. Animate story beats, sync speaker notes, and ship
            polished slides without leaving the browser.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-slate-800/70 bg-slate-950/70 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          Live session
        </div>
      </header>

      <section className="relative z-10 mt-8 grid flex-1 gap-10 lg:grid-cols-[1.2fr_minmax(0,0.8fr)]">
        <div className="flex flex-col justify-between gap-8">
          <div className="grid gap-4 rounded border border-slate-800/70 bg-slate-950/60 p-6 text-sm text-slate-200">
            <Feature
              tone="bg-cyan-400"
              title="Stage-aware layouts"
              body="Design right inside the Stage that powers presentation mode—layouts never shift when you go live."
            />
            <Feature
              tone="bg-fuchsia-400"
              title="Copilot choreography"
              body="Ask for new structures, diagrams, or speaker scripts. Copilot writes JSX and notes side-by-side."
            />
            <Feature
              tone="bg-emerald-400"
              title="Version-native decks"
              body="Commit every variation, diff visuals, and roll back confidently without losing the narrative."
            />
          </div>

          <div className="grid gap-4 rounded border border-slate-800/70 bg-slate-950/60 p-6 md:grid-cols-3">
            <Metric label="Slides shipped" value="24" trend="+6 this week" />
            <Metric label="Copilot prompts" value="132" trend="84% applied" />
            <Metric label="Presenter score" value="9.4" trend="Audience rating" />
          </div>
        </div>

        <aside className="flex flex-col gap-6 border border-slate-800/70 bg-slate-950/60 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Motion path</p>
            <h2 className="mt-2 text-lg font-semibold text-white">DeckLab creative loop</h2>
          </div>
          <div className="flex flex-col gap-4 text-sm text-slate-100">
            <TimelineStep
              accent="bg-cyan-300"
              title="Ideate"
              description="Seed Copilot with your brief. Generate scaffolded sections, hero blocks, and color palettes."
            />
            <TimelineStep
              accent="bg-violet-300"
              title="Compose"
              description="Drop JSX into the Stage and watch Tailwind-powered animations unfold as you type."
            />
            <TimelineStep
              accent="bg-rose-300"
              title="Rehearse"
              description="Lock speaker notes to each slide and preview presenter view directly in the playground."
            />
          </div>
          <div className="mt-auto grid gap-3 border-t border-slate-800/70 pt-4 text-xs text-slate-400/90 md:grid-cols-2">
            <StatusPill tone="bg-cyan-400/30 text-cyan-100" label="Stage 1280×720" />
            <StatusPill tone="bg-emerald-400/30 text-emerald-100" label="Auto-save on" />
            <StatusPill tone="bg-fuchsia-400/30 text-fuchsia-100" label="Animations synced" />
            <StatusPill tone="bg-blue-400/30 text-blue-100" label="Copilot connected" />
          </div>
        </aside>
      </section>

      <footer className="relative z-10 mt-10 flex flex-wrap items-center gap-4 border-t border-slate-800/70 pt-4 text-xs text-slate-400/90">
        <span>⌘ + S saves a revision snapshot</span>
        <span className="hidden md:inline-flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
          Presenter view mirrors Stage in real time
        </span>
        <span className="inline-flex animate-[shimmer_6s_ease-in-out_infinite] items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300" />
          Live compile: esbuild-wasm
        </span>
      </footer>
    </div>
  );
}

function Feature({ tone, title, body }: { tone: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-1 inline-flex h-2 w-2 flex-none rounded-full ${tone}`} />
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-slate-300/90">{body}</p>
      </div>
    </div>
  );
}

function Metric({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="flex flex-col gap-1 border border-slate-800/70 bg-slate-950/70 px-4 py-3 text-left">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-slate-400">{trend}</p>
    </div>
  );
}

function TimelineStep({
  accent,
  title,
  description,
}: {
  accent: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className={`mt-1 inline-flex h-2 w-2 flex-none rounded-full ${accent}`} />
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-slate-400/90">{description}</p>
      </div>
    </div>
  );
}

function StatusPill({ tone, label }: { tone: string; label: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-2 font-medium ${tone}`}>
      {label}
    </span>
  );
}
