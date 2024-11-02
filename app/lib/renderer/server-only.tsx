import { type RendererProps } from "./types";
import { useHydrated } from "./use-hydrated";

export function ServerOnly({ children, fallback = null }: RendererProps) {
  return useHydrated() ? <>{fallback}</> : <>{children()}</>;
}
