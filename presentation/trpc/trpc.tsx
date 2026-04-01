import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import superjson from "superjson";
import type { AppRouter } from "@/server/routers";
import { getApiBaseUrl } from "@/shared/constants/oauth";
import { Platform } from "react-native";
import { useRepositories } from "@/application/hooks/use-repositories";

/**
 * tRPC React client for type-safe API calls.
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Encapsulated tRPC and QueryClient Provider.
 * This MUST be placed inside the DependencyProvider to access repositories.
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { authStorageRepository } = useRepositories();

  const apiBaseUrl = useMemo(() => getApiBaseUrl() ?? "", []);

  // Warn if API URL is missing on native
  if (!apiBaseUrl && Platform.OS !== "web") {
    console.warn(
      "[tRPC] EXPO_PUBLIC_API_BASE_URL is not set. API calls will fail."
    );
  }

  // Create clients once and maintain them in state
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${apiBaseUrl}/api/trpc`,
          transformer: superjson,
          async headers() {
            const token = await authStorageRepository.getSessionToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
