import { type ReactNode, createContext, useContext, useMemo } from "react";
import { createApiClient } from "../lib/apiClient";
import type { ApiClientOptions, DecklabApiClient } from "../lib/apiClient";
import { useAuth } from "./useAuth";

interface ApiClientContextValue {
  apiClient: DecklabApiClient;
}

const ApiClientContext = createContext<ApiClientContextValue | undefined>(
  undefined
);

export function ApiClientProvider({ children }: { children: ReactNode }) {
  const { userManager } = useAuth();

  const baseUrl = useMemo(() => import.meta.env.VITE_API_URL ?? "/api", []);

  const apiClient = useMemo<DecklabApiClient>(() => {
    const mode = import.meta.env.VITE_API_CLIENT_MODE || "http";
    const options: ApiClientOptions = {
      baseUrl,
      getAccessToken: async () => {
        const currentUser = await userManager.getUser();
        return currentUser?.access_token;
      },
    };
    return createApiClient(options, mode);
  }, [baseUrl, userManager]);

  const value = useMemo<ApiClientContextValue>(
    () => ({
      apiClient,
    }),
    [apiClient]
  );

  return (
    <ApiClientContext.Provider value={value}>
      {children}
    </ApiClientContext.Provider>
  );
}

export function useApiClient(): ApiClientContextValue {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }
  return context;
}
