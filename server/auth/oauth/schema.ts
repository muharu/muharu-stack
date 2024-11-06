import { z } from "zod";

// Define the provider schema
export const oauthProviderSchema = z.enum(["google", "discord", "github"]);
