import type { MetaFunction, SerializeFrom } from "@remix-run/node";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/app";
import { Button, buttonVariants } from "~/components/ui/button";
import { handleTRPCError } from "~/lib/errors";
import { userQueryOption } from "./query";

export async function loader({ context }: LoaderFunctionArgs) {
  const { trpcCaller } = context;
  try {
    const data = await trpcCaller.hello({ name: "Muharu" });
    return json({ data });
  } catch (error) {
    const handledError = handleTRPCError(error);
    if (handledError.code === "NOT_FOUND") {
      return json({ data: null });
    }
  }
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const data = queryClient.getQueryData<SerializeFrom<typeof loader>>(
    userQueryOption.queryKey,
  );
  if (!data) {
    const serverData = await serverLoader<SerializeFrom<typeof loader>>();
    if (!serverData?.data) return null;
    queryClient.setQueryData<SerializeFrom<typeof loader>>(
      userQueryOption.queryKey,
      serverData,
    );
    return serverData;
  }
  return data;
}

clientLoader.hydrate = true;

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function IndexPage() {
  const { data, isLoading, refetch, isRefetching } = useQuery(userQueryOption);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="my-4">
        {isLoading || isRefetching ? "Loading..." : JSON.stringify(data)}
      </div>

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
