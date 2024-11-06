import { z } from "zod";
import { oauthProviderSchema } from "./schema";

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;

export interface BasePKCE {
  codeFromUrl: string | null;
  stateFromUrl: string | null;
  stateFromCookie: string | null;
}

export interface GooglePKCE extends BasePKCE {
  codeVerifierFromCookie: string | null;
}
