import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "server/trpc";

declare global {
  const PUBLIC_BASE_URL: string;
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
