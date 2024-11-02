import { hc } from "hono/client";
import type { ApiRoutes } from "server/hono/root";

const client = hc<ApiRoutes>("/");

export const rpc = client.api;
