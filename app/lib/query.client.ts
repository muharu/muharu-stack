import { remember } from "@epic-web/remember";
import { QueryClient } from "@tanstack/react-query";

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
