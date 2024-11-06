import { COOKIE_NAME } from "./constants";
import { validateBasicPKCE, validateGooglePKCE } from "./oauth/pkce";
import { createGoogleAuthURL } from "./oauth/provider/google";
import { validatePKCESchema } from "./schema";
import { validateSessionToken } from "./session";
import { OAuthProvider, ValidateProofKeyCodeExchangeInput } from "./types";
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
  }) {
    const authDataFromRequest = this.getAuthDataFromRequest({
      provider,
      request,
    });
    const isPKCEValid = this.validateProofKeyCodeExchange({
      provider,
      data: authDataFromRequest,
    });
    if (!isPKCEValid) {
      return null;
    }
    return authDataFromRequest;
  }

  private getAuthDataFromRequest({
    provider,
    request,
  }: {
    provider: OAuthProvider;
    request: Request;
  }) {
    if (provider === "google") {
      const stateFromUrl = getQueryParam(request, "state");
      const codeFromUrl = getQueryParam(request, "code");
      const stateFromCookie = getCookie(request, COOKIE_NAME.GOOGLE_STATE);
      const codeVerifierFromCookie = getCookie(
        request,
        COOKIE_NAME.GOOGLE_CODE_VERIFIER,
      );
      return {
        stateFromUrl,
        codeFromUrl,
        stateFromCookie,
        codeVerifierFromCookie,
      };
    } else {
      const stateFromUrl = getQueryParam(request, "state");
      const codeFromUrl = getQueryParam(request, "code");
      const stateFromCookie = getCookie(request, COOKIE_NAME.GOOGLE_STATE);
      return {
        stateFromUrl,
        codeFromUrl,
        stateFromCookie,
      };
    }
  }

  private validateProofKeyCodeExchange(
    input: ValidateProofKeyCodeExchangeInput,
  ): boolean {
    try {
      const validInput = validatePKCESchema.parse(input);
      const { provider, data } = validInput;
      if (provider === "google") {
        return validateGooglePKCE(data);
      } else {
        return validateBasicPKCE(data);
      }
    } catch {
      return false;
    }
  }
}
