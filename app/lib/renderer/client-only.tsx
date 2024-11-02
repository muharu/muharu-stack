import { type RendererProps } from "./types";
import { useHydrated } from "./use-hydrated";

export function ClientOnly({ children, fallback = null }: RendererProps) {
  return useHydrated() ? <>{children()}</> : <>{fallback}</>;
}
