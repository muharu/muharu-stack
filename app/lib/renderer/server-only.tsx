import * as React from "react";
import { useHydrated } from "./use-hydrated";

type ServerOnlyProps = {
  children(): React.ReactNode;
  fallback?: React.ReactNode;
};

export function ServerOnly({ children, fallback = null }: ServerOnlyProps) {
  return useHydrated() ? <>{fallback}</> : <>{children()}</>;
}
