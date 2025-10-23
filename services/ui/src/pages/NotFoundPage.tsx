import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function NotFoundPage() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;

      const glow = glowRef.current;
      if (glow) {
        const { width, height } = glow.getBoundingClientRect();
        glow.style.transform = `translate3d(${x - width / 2}px, ${
          y - height / 2
        }px, 0)`;
      }

      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-white">
      <div className="background-grid" aria-hidden="true" />
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
          <Link
            className="inline-flex items-center gap-3 font-display text-sm uppercase tracking-[0.18em] text-white transition hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            to="/"
          >
            <span
              className="h-3 w-3 rounded-full bg-[linear-gradient(135deg,#00ffff,#9b5cf6)] shadow-[0_0_12px_rgba(0,255,255,0.7)]"
              aria-hidden="true"
            />
            DeckLab
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">
        <div className="text-center">
          <h1 className="font-display text-8xl text-cyan-300 mb-4 sm:text-9xl">
            404
          </h1>

          <p className="text-xl text-white/60 mb-8 sm:text-2xl">
            You must be lost.
          </p>

          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full border-none bg-gradient-to-br from-cyan-400/80 via-[#00ffffcc] to-[#9b5cf6cc] px-8 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(0,255,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            to="/"
          >
            Return home
          </Link>
        </div>
      </main>
    </div>
  );
}
