import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAlert } from "../hooks/useAlerts";

type Plan = "Basic" | "Pro" | "Enterprise";

const plans = [
  {
    id: "Basic" as Plan,
    name: "Basic",
    price: "$0",
    description: "Personal use — essential editing & previews.",
  },
  {
    id: "Pro" as Plan,
    name: "Pro",
    price: "$29",
    description: "For small teams: collaboration and exports.",
  },
  {
    id: "Enterprise" as Plan,
    name: "Enterprise",
    price: "Custom",
    description: "Security, support, and custom workflows for orgs.",
  },
];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("Basic");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const requiresPayment = selectedPlan !== "Basic";

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (
      planParam &&
      (planParam === "Basic" ||
        planParam === "Pro" ||
        planParam === "Enterprise")
    ) {
      setSelectedPlan(planParam as Plan);
    }
  }, [searchParams]);

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
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_32px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl text-white mb-2">
                Create your account
              </h1>
              <p className="text-sm text-white/60">
                Start building collaborative decks today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 transition focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="you@company.com"
                />
              </div>

              {/* Password */}
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
                  placeholder="At least 8 characters"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 transition focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Re-enter your password"
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label className="mb-3 block text-sm font-medium text-white/80">
                  Choose your plan
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`rounded-xl border p-4 text-left transition ${
                        selectedPlan === plan.id
                          ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_24px_rgba(0,255,255,0.15)]"
                          : "border-white/10 bg-black/20 hover:border-white/20"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-display text-lg text-white">
                          {plan.name}
                        </span>
                        {selectedPlan === plan.id && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-cyan-300 mb-1">
                        {plan.price}
                      </p>
                      <p className="text-xs text-white/50 line-clamp-2">
                        {plan.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details (conditional) */}
              {requiresPayment && (
                <div className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="font-display text-lg text-white">
                    Payment details
                  </h3>

                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="mb-2 block text-sm font-medium text-white/80"
                    >
                      Card number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required={requiresPayment}
                      maxLength={19}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 transition focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="cardExpiry"
                        className="mb-2 block text-sm font-medium text-white/80"
                      >
                        Expiry date
                      </label>
                      <input
                        id="cardExpiry"
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required={requiresPayment}
                        maxLength={5}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 transition focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cardCvc"
                        className="mb-2 block text-sm font-medium text-white/80"
                      >
                        CVC
                      </label>
                      <input
                        id="cardCvc"
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required={requiresPayment}
                        maxLength={4}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 transition focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-br from-cyan-400/80 via-[#00ffffcc] to-[#9b5cf6cc] px-6 py-3 font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(0,255,255,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                {requiresPayment ? "Pay now" : "Register"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
