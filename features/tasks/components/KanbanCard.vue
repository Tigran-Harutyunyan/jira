<script setup lang="ts">
import { MoreHorizontal } from "lucide-vue-next";

import MemberAvatar from "@/features/members/components/MemberAvatar.vue";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";

import DottedSeparator from "@/components/DottedSeparator.vue";

import TaskDate from "@/features/tasks/components/TaskDate.vue";
import ActionsCell from "@/features/tasks/components/columns/ActionsCell.vue";

import { type Task } from "@/features/tasks/types";

interface KanbanCardProps {
  task: Task;
}
defineProps<KanbanCardProps>();
</script>

<template>
  <div class="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
    <div class="flex items-start justify-between gap-x-2">
      <p class="text-sm line-clamp-2">{{ task.name }}</p>
      <ActionsCell
        :id="task.$id"
        :projectId="task.projectId"
        :is-kanban-card="true"
      >
        <MoreHorizontal
          class="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition"
        />
      </ActionsCell>
    </div>
    <DottedSeparator />
    <div class="flex items-center gap-x-1.5">
      <MemberAvatar
        :name="task.assignee.name"
        fallbackClassName="text-[10px]"
      />
      <div class="size-1 rounded-full bg-neutral-300" />
      <TaskDate :value="task.dueDate" class="text-xs" />
    </div>
    <div class="flex items-center gap-x-1.5">
      <ProjectAvatar
        :name="task.project.name"
        :image="task.project.imageUrl"
        fallbackClassName="text-[10px]"
      />
      <span class="text-xs font-medium">{{ task.project.name }}</span>
    </div>
  </div>
</template>
