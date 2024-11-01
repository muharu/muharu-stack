import type { MetaFunction } from "@remix-run/node";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "~/lib/auth";

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function Index() {
  const { mutate: signinGithub } = useMutation({
    mutationFn: async () => {
      const { data } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
      return data;
    },
  });

  return (
    <main>
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        <button onClick={() => signinGithub()}>Login with Github</button>
      </div>
    </main>
  );
}
