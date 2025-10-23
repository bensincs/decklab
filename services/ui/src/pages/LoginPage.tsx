import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../hooks/useAlerts";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showAlert } = useAlert();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    showAlert(
      "We aren't quite ready for you yet! Stay tuned for our launch.",
      "warning",
      true
    );
  };
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-white">
      <div className="background-grid" aria-hidden="true" />

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
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_32px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl text-white mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-white/60">
                Sign in to continue to DeckLab
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Email
                </label>
                <input
                  id="username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 transition focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 transition focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-br from-cyan-400/80 via-[#00ffffcc] to-[#9b5cf6cc] px-6 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(0,255,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
