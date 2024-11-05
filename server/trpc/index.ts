import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const mockDB = [
  {
    name: "Muharu",
    age: 20,
  },
];

export const appRouter = router({
  user: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const result = mockDB.find(({ name }) => input.name === name);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return result;
    }),
});

export type AppRouter = typeof appRouter;

const createCallerFactory = t.createCallerFactory;
export const createCaller = createCallerFactory(appRouter);
