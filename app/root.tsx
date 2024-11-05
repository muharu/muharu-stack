import type {
  LinksFunction,
  LoaderFunctionArgs,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { type PublicEnv } from "server/env";
import { App } from "./app";
import { ScriptPublicEnv } from "./components/shared/script-env";
import { queryClient } from "./lib/query.client";
import "./tailwind.css";

export async function loader({ context }: LoaderFunctionArgs) {
  const { env } = context;
  const publicEnv: { [key: string]: string } = {};
  for (const key in env) {
    if (Object.hasOwn(env, key) && key.startsWith("PUBLIC_")) {
      publicEnv[key] = String((env as Record<string, unknown>)[key]);
    }
  }
  return json({ publicEnv: publicEnv as PublicEnv });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const data = queryClient.getQueryData<SerializeFrom<typeof loader>>(["root"]);
  if (!data) {
    const serverData = await serverLoader<SerializeFrom<typeof loader>>();
    queryClient.setQueryData(["root"], serverData);
    return serverData;
  }
  return data;
}

clientLoader.hydrate = true;

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Document({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { publicEnv } = useLoaderData<typeof clientLoader>();
  return (
    <html lang="en">
      <Head />
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <ScriptPublicEnv pubicEnv={publicEnv} />
      </body>
    </html>
  );
}

function Head() {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
  );
}

export default function Root() {
  return (
    <Document>
      <App />
    </Document>
  );
}
