import { useFetcher } from "@remix-run/react";
import { type OAuthProvider } from "server/auth/types";

export function useSignin() {
  const fetcher = useFetcher();
  const oauth = (provider: OAuthProvider) => {
    fetcher.submit({ provider }, { method: "post" });
  };
  return { signin: { oauth }, state: fetcher.state };
}
