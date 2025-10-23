import type { ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ApiClientProvider } from "./hooks/useApiClient";
import { AuthProvider as OidcAuthProvider, useAuth } from "./hooks/useAuth";
import { oidcConfig } from "./lib/authConfig";
import { AlertProvider } from "./hooks/useAlerts";
import LandingPage from "./pages/LandingPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (!user) {
    return <Navigate replace to="/auth/login" />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <OidcAuthProvider config={oidcConfig}>
        <ApiClientProvider>
          <AlertProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route
                path="/app"
                element={
                  <RequireAuth>
                    <Outlet />
                  </RequireAuth>
                }
              >
                <Route index element={<div />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AlertProvider>
        </ApiClientProvider>
      </OidcAuthProvider>
    </BrowserRouter>
  );
}
