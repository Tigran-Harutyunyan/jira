<script setup lang="ts">
import { type Task } from "@/features/tasks/types";
import { CalendarIcon, PlusIcon } from "lucide-vue-next";
import { useCreateTaskModal } from "@/features/tasks/store/useCreateTaskModal";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { formatDistanceToNow } from "date-fns";

const workspaceId = useWorkspaceId();

interface TaskListProps {
  data: Task[];
  total: number;
}

defineProps<TaskListProps>();

const { onOpen } = useCreateTaskModal();
</script>

<template>
  <div class="flex flex-col gap-y-4 col-span-1">
    <div class="bg-muted rounded-lg p-4">
      <div class="flex items-center justify-between">
        <p class="text-lg font-semibold">Tasks ({{ total }})</p>
        <Button variant="muted" size="icon" @click="onOpen">
          <PlusIcon class="size-4 text-neutral-400" />
        </Button>
      </div>
      <DottedSeparator class="my-4" />
      <ul class="flex flex-col gap-y-4">
        <li v-for="task in data" :key="task.$id">
          <NuxtLink :to="`/workspaces/${workspaceId}/tasks/${task.$id}`">
            <Card class="shadow-none rounded-lg hover:opacity-75 transition">
              <CardContent class="p-4">
                <p class="text-lg font-medium truncate">{{ task.name }}</p>
                <div class="flex items-center gap-x-2">
                  <p>{{ task.project?.name }}</p>
                  <div class="size-1 rounded-full bg-neutral-300" />
                  <div class="text-sm text-muted-foreground flex items-center">
                    <CalendarIcon class="size-3 mr-1" />
                    <span class="truncate">
                      {{ formatDistanceToNow(new Date(task.dueDate)) }}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </NuxtLink>
        </li>
        <li
          class="text-sm text-muted-foreground text-center hidden first-of-type:block"
        >
          No tasks found
        </li>
      </ul>
      <Button variant="muted" class="mt-4 w-full" as-child>
        <NuxtLink :to="`/workspaces/${workspaceId}/tasks`"> Show All </NuxtLink>
      </Button>
    </div>
  </div>
</template>
