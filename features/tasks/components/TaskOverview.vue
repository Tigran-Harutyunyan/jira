<script setup lang="ts">
import { type Task } from "../types";
import { PencilIcon } from "lucide-vue-next";
import MemberAvatar from "@/features/members/components/MemberAvatar.vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { snakeCaseToTitleCase } from "@/lib/utils";
import DottedSeparator from "@/components/DottedSeparator.vue";
import TaskDate from "./TaskDate.vue";
import OverviewProperty from "./OverviewProperty.vue";
import { useEditTaskModal } from "@/features/tasks/store/useEditTaskModal";
import EditTaskModal from "@/features/tasks/components/EditTaskModal.vue";

const { onOpen } = useEditTaskModal();

interface TaskOverviewProps {
  task: Task;
}

defineProps<TaskOverviewProps>();
</script>

<template>
  <EditTaskModal />
  <div class="flex flex-col gap-y-4 col-span-1">
    <div class="bg-muted rounded-lg p-4">
      <div class="flex items-center justify-between">
        <p class="text-lg font-semibold">Overview</p>
        <Button @click="onOpen(task.$id)" size="sm" variant="secondary">
          <PencilIcon class="size-4 mr-2" />
          Edit
        </Button>
      </div>
      <DottedSeparator class="my-4" />
      <div class="flex flex-col gap-y-4">
        <OverviewProperty label="Assignee">
          <MemberAvatar :name="task.assignee.name" class="size-6" />
          <p class="text-sm font-medium">{{ task.assignee.name }}</p>
        </OverviewProperty>
        <OverviewProperty label="Due Date">
          <TaskDate :value="task.dueDate" class="text-sm font-medium" />
        </OverviewProperty>
        <OverviewProperty label="Status">
          <Badge :variant="task.status">
            {{ snakeCaseToTitleCase(task.status) }}
          </Badge>
        </OverviewProperty>
      </div>
    </div>
  </div>
</template>
