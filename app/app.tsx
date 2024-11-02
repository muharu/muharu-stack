import { Outlet } from "@remix-run/react";
import { TRPCProvider } from "./lib/trpc/provider";

export function App() {
  return (
    <TRPCProvider>
      <Outlet />
    </TRPCProvider>
  );
}
