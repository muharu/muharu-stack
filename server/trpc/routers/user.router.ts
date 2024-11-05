import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const mockDB = [
  {
    name: "Muharu",
    age: 20,
  },
];

export const userRouter = createTRPCRouter({
  getOne: publicProcedure
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
