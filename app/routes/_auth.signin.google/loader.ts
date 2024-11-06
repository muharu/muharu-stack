import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "server/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const validData = auth.validateOauthSigninRequest({
    provider: "github",
    request,
  });
  if (!validData) return redirect("/signin");

  return null;
}
