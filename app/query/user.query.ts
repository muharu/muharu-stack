import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api.client";
import { handleTRPCError } from "~/lib/errors";
import { RouterOutputs } from "~/types";

type InitialDataUser = RouterOutputs["user"]["getOne"];

export function useGetUser(initialData?: InitialDataUser | null) {
  return useQuery({
    ...userQueryOption,
    enabled: !!initialData,
    initialData: initialData ?? undefined,
  });
}

export const userQueryOption = queryOptions({
  queryKey: ["user"],
  queryFn: async () => await api.trpc.user.getOne.query({ name: "Muharu" }),
  retry(failureCount, error) {
    const handledError = handleTRPCError(error);
    if (handledError.code === "NOT_FOUND") return false;
    return failureCount < 3;
  },
});
