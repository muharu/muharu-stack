import { z } from "zod";
import { COOKIE_NAME } from "./constants";
import { validateBasicPKCE, validateGooglePKCE } from "./oauth/pkce";
import { createGoogleAuthURL } from "./oauth/provider/google";
import { validateSessionToken } from "./session";
import type { OAuthProvider } from "./types";
import {
  createAuthBlankCoookie,
  createAuthCookie,
  createTemporaryAuthCookie,
  getCookie,
  getQueryParam,
} from "./utils";

export class Auth {
  public generateAuthorizationURL({ provider }: { provider: OAuthProvider }) {
    if (provider === "google") {
      const { url, state, codeVerifier } = createGoogleAuthURL();
      const stateCookie = createTemporaryAuthCookie(
        COOKIE_NAME.GOOGLE_STATE,
        state,
      );
      const codeVerifierCookie = createTemporaryAuthCookie(
        COOKIE_NAME.GOOGLE_CODE_VERIFIER,
        codeVerifier,
      );
      const headers = new Headers();
      headers.append("Set-Cookie", stateCookie);
      headers.append("Set-Cookie", codeVerifierCookie);
      return { url, headers };
    }
    throw new Error("Unsupported provider");
  }

  public async validateRequest(request: Request) {
    const headers = new Headers();
    const sessionTokenFromCookie = getCookie(
      request,
      COOKIE_NAME.SESSION_TOKEN,
    );
    if (!sessionTokenFromCookie) return { user: null, session: null, headers };
    const { session, user } = await validateSessionToken(
      sessionTokenFromCookie,
    );
    if (!session) {
      const blankSessionCookie = createAuthBlankCoookie(
        COOKIE_NAME.SESSION_TOKEN,
      );
      headers.append("Set-Cookie", blankSessionCookie);
      return { user: null, session: null, headers };
    }
    const updatedSessionCookie = createAuthCookie(
      COOKIE_NAME.SESSION_TOKEN,
      session.id,
      session.expiresAt,
    );
    headers.append("Set-Cookie", updatedSessionCookie);
    return { user, session, headers };
  }

  public validateOauthSigninRequest({
    provider,
    request,
  }: {
    provider: OAuthProvider;
    request: Request;
  }): { code: string } | null {
    const stateFromUrl = getQueryParam(request, "state");
    const codeFromUrl = getQueryParam(request, "code");
    const stateFromCookie = getCookie(request, COOKIE_NAME.GOOGLE_STATE);
    if (provider === "google") {
      const codeVerifierFromCookie = getCookie(
        request,
        COOKIE_NAME.GOOGLE_CODE_VERIFIER,
      );
      const isValidPKCE = validateGooglePKCE({
        codeFromUrl,
        stateFromUrl,
        stateFromCookie,
        codeVerifierFromCookie,
      });
      if (!isValidPKCE) return null;
      const schema = z.object({
        stateFromUrl: z.string(),
        codeFromUrl: z.string(),
        stateFromCookie: z.string(),
        codeVerifierFromCookie: z.string(),
      });
      const result = schema.safeParse({
        stateFromUrl,
        codeFromUrl,
        stateFromCookie,
        codeVerifierFromCookie,
      });
      if (!result.success) return null;
      return { code: result.data.codeFromUrl };
    } else {
      const schema = z.object({
        stateFromUrl: z.string(),
        codeFromUrl: z.string(),
        stateFromCookie: z.string(),
      });
      const isValidPKCE = validateBasicPKCE({
        codeFromUrl,
        stateFromUrl,
        stateFromCookie,
      });
      if (!isValidPKCE) return null;
      const result = schema.safeParse({
        stateFromUrl,
        codeFromUrl,
        stateFromCookie,
      });
      if (!result.success) return null;
      return { code: result.data.codeFromUrl };
    }
  }
}