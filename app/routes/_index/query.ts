import { queryOptions } from "@tanstack/react-query";
import { api } from "~/lib/api.client";

export const helloQueryOption = queryOptions({
  queryKey: ["hello"],
  queryFn: async () => {
    const data = await api.trpc.hello.query({ name: "Client Side Fetch" });
    return data;
  },
});
