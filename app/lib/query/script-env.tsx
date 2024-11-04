import { type ClientEnv } from "server/env";

export function ScriptPublicEnv({
  pubicEnv,
}: Readonly<{ pubicEnv: ClientEnv }>) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.env = ${JSON.stringify(pubicEnv)};`,
      }}
    />
  );
}

declare global {
  interface Window {
    env: ClientEnv;
  }
}
