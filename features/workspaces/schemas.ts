import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const createWorkspaceSchema = toTypedSchema(z.object({
  name: z.string().trim().min(1, "Required"),
  // image: z.union([
  //   z.instanceof(File),
  //   z.string().transform((value) => value === "" ? undefined : value),
  // ])
  //   .optional(),
}));

export const updateWorkspaceSchema = toTypedSchema(z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === "" ? undefined : value),
  ])
    .optional(),
}));
