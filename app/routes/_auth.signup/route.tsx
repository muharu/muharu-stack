import type { MetaFunction } from "@remix-run/node";
import { FaGoogle } from "react-icons/fa";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Signup" }];
};

export default function SignupPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Button size="lg" variant="outline">
        <FaGoogle className="size-5" /> Signup with Google
      </Button>
    </main>
  );
}
