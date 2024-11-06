import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import chalk from "chalk";
import { Context } from "hono";
import { auth } from "server/auth";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = (
  _opts: FetchCreateContextFnOptions,
  honoCtx: Context,
) => {
  return { honoCtx };
};

/**
 * Initializes tRPC with a custom context and transformer.
 *
 * The tRPC instance uses `superjson` to handle serialization
 * and provides a custom error formatter that handles Zod validation errors.
 */
export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Factory for creating a caller that can invoke procedures directly on the server.
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Creates a tRPC router that can be used to define routes
 */
export const createTRPCRouter = t.router;

/**
 * Middleware to log the execution time of procedures
 *
 * This middleware records the start time before executing the next middleware or procedure,
 * and logs the duration taken for execution. In development environments, it introduces
 * an artificial delay to simulate network latency.
 *
 * @param next - The next middleware or procedure to execute
 * @param path - The path of the procedure being executed
 * @returns The result of the next middleware or procedure
 */
export const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  let delayMs = 0;
  // Simulate network latency in development mode
  if (t._config.isDev) {
    delayMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  console.log(`⏱️  [TRPC]: Starting execution for ${path}`);
  const result = await next();
  const end = Date.now();
  const duration = end - start;
  console.log(
    chalk.black(
      `⏱️  [TRPC]: ${chalk.cyan(path)} took ${chalk.green.bold(duration + "ms")} to execute.`,
    ),
  );
  return result;
});

/**
 * Middleware to enforce user authentication.
 *
 * This middleware checks if the user is authenticated by verifying the presence
 * of a `user` object in the context. If the `user` is not authenticated, it throws
 * an `UNAUTHORIZED` error. Otherwise, it proceeds to the next middleware or procedure.
 *
 * @param ctx - The current context containing user and session information
 * @param next - The next middleware or procedure to execute
 * @returns The result of the next middleware or procedure
 * @throws TRPCError with code "UNAUTHORIZED" if the user is not authenticated
 */
export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const { user, session } = await auth.validateRequest(ctx.honoCtx.req.raw);
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  });
});

/**
 * Defines a public procedure can be used without authentication.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Defines an authenticated procedure.
 *
 * This procedure requires the user to be authenticated before it can be invoked.
 */
export const authProcedure = t.procedure
  .use(timingMiddleware)
  .use(authMiddleware);
