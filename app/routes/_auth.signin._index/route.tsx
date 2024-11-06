import { Link } from "@remix-run/react";
import { FaGoogle } from "react-icons/fa";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { action } from "./action";
import { useSignin } from "./hooks/use-signin";
import { meta } from "./meta";

export default function SigninPage() {
  const { signin, state } = useSignin();

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Link
        to="/"
        className={cn(
          buttonVariants({ size: "lg", variant: "outline" }),
          "my-4",
        )}
      >
        Back to Home
      </Link>

      <Button
        size="lg"
        variant="outline"
        disabled={state === "submitting"}
        onClick={() => signin.oauth("google")}
      >
        <FaGoogle className="size-5" /> Signup with Google
      </Button>
    </main>
  );
}

export { action, meta };
