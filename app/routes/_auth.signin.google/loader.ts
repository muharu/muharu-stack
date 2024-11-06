import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "server/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const validData = auth.validateOauthSigninRequest({
    provider: "google",
    request,
  });
  if (!validData) return redirect("/signin");
  const { code, codeVerifier } = validData;
  console.log("code", code);
  console.log("codeVerifier", codeVerifier);
  return null;
}
