import { Outlet } from "@remix-run/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TRPCProvider } from "./lib/query/provider";

export function App() {
  return (
    <TRPCProvider>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </TRPCProvider>
  );
}
