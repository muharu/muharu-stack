import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserFromCookie, User } from "server/auth";
import { buttonVariants } from "~/components/ui/button";

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
    <main className="flex h-screen flex-col items-center justify-center">
      {user ? JSON.stringify(user) : "Not logged in"}

      <div className="mt-4 flex gap-x-2">
        <Link to="/signin" className={buttonVariants()}>
          Signin
        </Link>
        <Link to="/signup" className={buttonVariants()}>
          Signup
        </Link>
      </div>
    </main>
  );
}
