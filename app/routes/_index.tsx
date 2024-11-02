import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function Index() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-5">
      <Link to="/signup" className={buttonVariants()}>
        Go to signup page
      </Link>
    </main>
  );
}
