import { type PublicEnv } from "server/env";

export function ScriptPublicEnv({
  pubicEnv,
}: Readonly<{ pubicEnv: PublicEnv }>) {
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
    env: PublicEnv;
  }
}
