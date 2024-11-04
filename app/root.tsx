import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { type PublicEnv } from "server/env";
import { App } from "./app";
import { ScriptPublicEnv } from "./lib/query/script-env";
import "./tailwind.css";

export const loader: LoaderFunction = async ({ context }) => {
  const { env } = context;
  const publicEnv = Object.keys(env)
    .filter((key) => key.startsWith("PUBLIC_"))
    .reduce((acc: { [key: string]: string }, key) => {
      acc[key] = String(env[key as keyof typeof env]);
      return acc;
    }, {});
  return json({ publicEnv });
};

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
  const { publicEnv } = useLoaderData<{ publicEnv: PublicEnv }>();
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
