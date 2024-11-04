import { remember } from "@epic-web/remember";
import { Outlet } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
