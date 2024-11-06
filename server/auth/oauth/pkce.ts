import type { BasePKCE, GooglePKCE } from "../types";

export function validateBasicPKCE({
  stateFromUrl,
  codeFromUrl,
  stateFromCookie,
}: BasePKCE): boolean {
  if (!stateFromUrl || !codeFromUrl) return false;
  if (stateFromUrl !== stateFromCookie) return false;
  return true;
}

export function validateGooglePKCE({
  stateFromUrl,
  codeFromUrl,
  stateFromCookie,
  codeVerifierFromCookie,
}: GooglePKCE): boolean {
  const isBasicPKCEValid = validateBasicPKCE({
    stateFromUrl,
    codeFromUrl,
    stateFromCookie,
  });
  if (!isBasicPKCEValid) return false;
  if (!codeVerifierFromCookie || !stateFromCookie) return false;
  return true;
}
