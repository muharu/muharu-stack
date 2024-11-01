import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function Index() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-5">
      <Link to="/signup" className="rounded-md border p-4">
        Go to signup page
      </Link>
    </main>
  );
}
