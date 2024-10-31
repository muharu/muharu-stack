import type { MetaFunction } from "@remix-run/node";
import { trpc } from "~/lib/trpc";

export const meta: MetaFunction = () => {
  return [{ title: "Create Muharu Stack" }];
};

export default function Index() {
  const { data, isLoading } = trpc.hello.useQuery({
    name: "Muharu",
  });
  return (
    <main>
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        {isLoading ? "Loading..." : data?.message}
      </div>
    </main>
  );
}
