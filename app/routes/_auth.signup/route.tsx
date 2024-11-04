import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { FaGoogle } from "react-icons/fa";
import { Button, buttonVariants } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Signup" }];
};

export default function SignupPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Button size="lg" variant="outline">
        <FaGoogle className="size-5" /> Signup with Google
      </Button>
      <Link
        to="/"
        className={buttonVariants({ size: "lg", variant: "outline" })}
      >
        Back to Home
      </Link>
    </main>
  );
}
