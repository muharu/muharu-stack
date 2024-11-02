import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { trpc } from "~/lib/trpc";

export const loader: LoaderFunction = async () => {
  return json({ message: "Hello, World!" });
};

export const meta: MetaFunction = () => {
  return [{ title: "Signup" }];
};

export default function AuthLayout() {
  const serverData = useLoaderData<typeof loader>();

  const { data, isLoading, refetch } = trpc.hello.useQuery(
    {
      name: "World",
    },
    {
      initialData: serverData,
    },
  );

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-5">
      {isLoading ? "Loading..." : data?.message}
      <button className={buttonVariants()} onClick={() => refetch()}>
        Refetch Test
      </button>
      <button className={buttonVariants()}>Signup With Github</button>
    </main>
  );
}
