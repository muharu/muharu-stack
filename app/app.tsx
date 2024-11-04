import { Outlet } from "@remix-run/react";
import { TRPCProvider } from "./lib/query/provider";

export function App() {
  return (
    <TRPCProvider>
      <Outlet />
    </TRPCProvider>
  );
}
