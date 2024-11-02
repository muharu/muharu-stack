import { bundleBun } from "./bun";
import { bundleNode } from "./node";
import { bundleVercel } from "./vercel";

export async function bundleAll() {
  const bundleVercelPromise = bundleVercel();
  const bundleNodePromise = bundleNode();
  const bundleBunPromise = bundleBun();

  await Promise.all([bundleVercelPromise, bundleNodePromise, bundleBunPromise]);
}
