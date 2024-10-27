<script lang="ts" setup>
import TaskOverview from "@/features/tasks/components/TaskOverview.vue";
import TaskDescription from "@/features/tasks/components/TaskDescription.vue";
import TaskBreadcrumbs from "@/features/tasks/components/TaskBreadcrumbs.vue";
import DottedSeparator from "@/components/DottedSeparator.vue";

import { type Task } from "@/features/tasks/types";
import { useTaskId } from "@/features/tasks/composables/useTaskId";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";

definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });

const taskId = useTaskId();
const workspaceId = useWorkspaceId();

const { isLoading, data } = useQuery<Task>({
  queryKey: ["task", taskId],
  queryFn: async () => $fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}`),
});
</script>

<template>
  <NuxtLayout name="standalone">
    <PageLoader v-if="isLoading" />
    <template v-else>
      <div v-if="data" class="flex flex-col">
        <TaskBreadcrumbs :project="data.project" :task="data" />
        <DottedSeparator class="my-6" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TaskOverview :task="data" />
          <TaskDescription :task="data" />
        </div>
      </div>
      <PageError v-else message="Task not found" />
    </template>
  </NuxtLayout>
</template>
