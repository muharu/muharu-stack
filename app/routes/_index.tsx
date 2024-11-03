import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserFromCookie, User } from "server/auth";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, headers } = await getUserFromCookie(request);
  return json({ user }, { headers });
};

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function IndexPage() {
  const { user } = useLoaderData<{ user: User }>();
  return (
    <main className="flex h-screen items-center justify-center">
      {user ? JSON.stringify(user) : "Not logged in"}
    </main>
  );
}
