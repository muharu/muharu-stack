import { z } from "zod";

import {
  basePKCESchema,
  googlePKCESchema,
  oauthProviderSchema,
  validatePKCESchema,
} from "./schema";

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type ValidateProofKeyCodeExchangeInput = z.infer<
  typeof validatePKCESchema
>;
export type BasePKCE = z.infer<typeof basePKCESchema>;
export type GooglePKCE = z.infer<typeof googlePKCESchema>;
