import { Hono } from "hono";
import { validator } from "hono/validator";
import { handleDiscordLogin } from "server/auth/oauth/discord";
import { handleGithubLogin } from "server/auth/oauth/github";
import { handleGoogleLogin } from "server/auth/oauth/google";
import { z } from "zod";

const SUPPORTED_OAUTH_PROVIDERS = ["google", "github", "discord"] as const;

export const authRoute = new Hono()
  .get("/signin", (ctx) => ctx.json({ message: "Not Implmented yet" }, 501))
  .get("/signup", (ctx) => ctx.json({ message: "Not Implmented yet" }, 501))
  .get(
    "/oauth/:provider",
    validator("param", (value, ctx) => {
      const schema = z.object({
        provider: z.enum(SUPPORTED_OAUTH_PROVIDERS, {
          message: "invalid provider",
        }),
      });
      const parsed = schema.safeParse(value);
      if (!parsed.success) {
        return ctx.json({ error: parsed.error.flatten().fieldErrors }, 400);
      }
      return parsed.data;
    }),
    (ctx) => {
      const { provider } = ctx.req.valid("param");

      switch (provider) {
        case "google":
          handleGoogleLogin();
          break;
        case "github":
          handleGithubLogin();
          break;
        case "discord":
          handleDiscordLogin();
          break;
        default:
          return ctx.json({ error: "invalid provider" }, 400);
      }

      return ctx.json({ provider });
    },
  )
  .get("/oauth/:provider/callback", (ctx) =>
    ctx.json({ message: "Not Implmented yet" }, 501),
  );
