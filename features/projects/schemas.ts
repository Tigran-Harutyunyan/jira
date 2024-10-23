import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const createProjectSchema = toTypedSchema(z.object({
  name: z.string().trim().min(1, "Required"),
  // image: z.union([
  //   z.instanceof(File),
  //   z.string().transform((value) => value === "" ? undefined : value),
  // ])
  //   .optional(),
  // workspaceId: z.string(),
}));

export const updateProjectSchema = toTypedSchema(z.object({
  name: z.string().trim().min(1, "Minimum 1 character required").optional(),
  // image: z.union([
  //   z.instanceof(File),
  //   z.string().transform((value) => value === "" ? undefined : value),
  // ])
  //   .optional(),
}));
