import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { TaskStatus } from "./types";

export const createTaskSchema = toTypedSchema(z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.string().min(10, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
}));
