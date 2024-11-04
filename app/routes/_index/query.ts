import { queryOptions } from "@tanstack/react-query";
import { api } from "~/lib/api.client";
import { handleTRPCError } from "~/lib/errors";

export const helloQueryOption = queryOptions({
  queryKey: ["hello"],
  queryFn: async () => {
    const data = await api.trpc.hello.query({ name: "Muharu" });
    return data;
  },
  retry(failureCount, error) {
    const handledError = handleTRPCError(error);
    if (handledError.code === "NOT_FOUND") return false;
    return failureCount < 3;
  },
});
