import { remember } from "@epic-web/remember";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const FIVE_MINUTES = 1000 * 60 * 5;

export const queryClient = remember(
  "react-query",
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: FIVE_MINUTES,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      },
    }),
);

export function TRPCProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
