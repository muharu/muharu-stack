import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ClientLoaderFunction, Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { buttonVariants } from "~/components/ui/button";
import { api } from "~/lib/query/api.client";
import { queryClient } from "~/lib/query/provider";

export const loader: LoaderFunction = async ({ context }) => {
  const { trpcCaller } = context;
  const data = await trpcCaller.hello({ name: "Server Side Fetch" });
  return json(data);
};

export const clientLoader: ClientLoaderFunction = async ({ serverLoader }) => {
  const cache = queryClient.getQueryData(["hello"]);
  if (cache) return cache;
  const data = await serverLoader();
  queryClient.setQueryData(["hello"], data);
  return data;
};
clientLoader.hydrate = true;

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function IndexPage() {
  const { data } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const data = await api.trpc.hello.query({ name: "Client Side Fetch" });
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1>{data?.message}</h1>
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
