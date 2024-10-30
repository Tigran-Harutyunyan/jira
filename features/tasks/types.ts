import { type Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE"
};

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  workspaceId: string;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  description?: string;
};

export type TaskFilters = {
  status: TaskStatus | null;
  assigneeId: string;
  projectId?: string;
  dueDate: string;
};

export const TASK_VIEW_TABS = {
  CALENDAR: "calendar",
  KANBAN: "kanban",
  TABLE: "table",
} as const;

export type TaskTabValue = typeof TASK_VIEW_TABS[keyof typeof TASK_VIEW_TABS]; 