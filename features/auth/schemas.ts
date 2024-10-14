import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const loginSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
}));

export const registerSchema = toTypedSchema(z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters required"),
}));

