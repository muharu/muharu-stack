import { generateCodeVerifier, generateState, Google } from "arctic";
import { env } from "server/env";

const google = new Google(
  env.AUTH_GOOGLE_CLIENT_ID,
  env.AUTH_GOOGLE_CLIENT_SECRET,
  env.PUBLIC_BASE_URL + "/signin/google",
);

export function createGoogleAuthURL() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];
  const generatedUrl = google.createAuthorizationURL(
    state,
    codeVerifier,
    scopes,
  );
  const url = generatedUrl.toString();
  return { state, codeVerifier, url };
}
