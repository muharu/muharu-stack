import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { auth } from "server/auth";
import { oauthProviderSchema } from "server/auth/schema";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const providerFromRequest = formData.get("provider");
    const provider = oauthProviderSchema.parse(providerFromRequest);
    const { url, headers } = auth.generateAuthorizationURL({ provider });
    return redirect(url, { headers });
  } catch {
    return redirect("/");
  }
}
