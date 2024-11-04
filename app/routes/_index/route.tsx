import type {
  LoaderFunction,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { ClientLoaderFunction, Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/app";
import { Button, buttonVariants } from "~/components/ui/button";
import { helloQueryOption } from "./query";

export const loader: LoaderFunction = async ({ context }) => {
  try {
    const { trpcCaller } = context;
    const data = await trpcCaller.hello({ name: "Muharu" });
    return json(data);
  } catch {
    return json({ data: null });
  }
};

export const clientLoader: ClientLoaderFunction = async ({ serverLoader }) => {
  const data = queryClient.getQueryData(helloQueryOption.queryKey);
  if (!data) {
    const serverData = await serverLoader<SerializeFrom<typeof loader>>();
    queryClient.setQueryData(helloQueryOption.queryKey, serverData);
    return serverData;
  }
  return data;
};
clientLoader.hydrate = true;

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function IndexPage() {
  const { data, isLoading, refetch, isRefetching } = useQuery(helloQueryOption);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1>{isLoading || isRefetching ? "Loading..." : data?.message}</h1>
      <Button onClick={() => refetch()}>Refetch</Button>
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
