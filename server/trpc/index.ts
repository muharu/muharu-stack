import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { db } from "server/db";
import { userTable } from "server/db/schema";
import superjson from "superjson";
import { z } from "zod";

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [result] = await db
        .select({ email: userTable.email })
        .from(userTable)
        .where(eq(userTable.name, input.name));

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        message: `This is your email from Database: ${result.email}`,
      };
    }),
});

export type AppRouter = typeof appRouter;

const createCallerFactory = t.createCallerFactory;
export const createCaller = createCallerFactory(appRouter);
