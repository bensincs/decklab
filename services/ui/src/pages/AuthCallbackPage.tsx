import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthCallbackPage() {
  const { userManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await userManager.signinRedirectCallback();
        navigate("/app/decks", { replace: true });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Authentication callback failed", error);
        navigate("/auth/login", { replace: true });
      }
    })();
  }, [navigate, userManager]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08090c] text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">
          DeckLab
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Signing you in…</h1>
        <p className="mt-2 text-white/60">
          Completing authentication and preparing your team workspaces.
        </p>
      </div>
    </div>
  );
}
