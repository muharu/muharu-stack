import { z } from "zod";

// Define the provider schema
export const oauthProviderSchema = z.enum(["google", "discord", "github"]);

// Base PKCE schema shared across all providers
export const basePKCESchema = z.object({
  stateFromUrl: z.string().nullable(),
  codeFromUrl: z.string().nullable(),
  stateFromCookie: z.string().nullable(),
});

// Extended PKCE schema specific to Google
export const googlePKCESchema = basePKCESchema.extend({
  codeVerifierFromCookie: z.string().nullable().optional(),
});

// Define each provider to the validation schema using discriminatedUnion
export const validatePKCESchema = z.discriminatedUnion("provider", [
  // Case for Google provider
  z.object({
    provider: z.literal("google"),
    data: googlePKCESchema,
  }),
  // Case for Discord provider
  z.object({
    provider: z.literal("discord"),
    data: basePKCESchema,
  }),
  // Case for Github provider
  z.object({
    provider: z.literal("github"),
    data: basePKCESchema,
  }),
]);
