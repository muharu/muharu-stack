import { z } from "zod";
import type { BasePKCE, GooglePKCE } from "../types";

const basicPKCESchema = z.object({
  stateFromUrl: z.string(),
  codeFromUrl: z.string(),
  stateFromCookie: z.string(),
});

const googlePKCESchema = basicPKCESchema.extend({
  codeVerifierFromCookie: z.string(),
});

export function validateBasicPKCE(args: BasePKCE) {
  const result = basicPKCESchema.safeParse(args);
  if (
    !result.success ||
    result.data.stateFromUrl !== result.data.stateFromCookie
  ) {
    return null;
  }
  return { code: result.data.codeFromUrl };
}

export function validateGooglePKCE(args: GooglePKCE) {
  const result = googlePKCESchema.safeParse(args);
  if (
    !result.success ||
    result.data.stateFromUrl !== result.data.stateFromCookie
  ) {
    return null;
  }
  return {
    code: result.data.codeFromUrl,
    codeVerifier: result.data.codeVerifierFromCookie,
  };
}
