<script setup lang="ts">
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-vue-next";

import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { TaskStatus } from "../types";
import { useCreateTaskModal } from "../store/useCreateTaskModal";

const { onOpen } = useCreateTaskModal();

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}
defineProps<KanbanColumnHeaderProps>();
</script>

<template>
  <div class="px-2 py-1.5 flex items-center justify-between">
    <div class="flex items-center gap-x-2">
      <CircleDashedIcon
        v-if="board === TaskStatus.BACKLOG"
        class="size-[18px] text-pink-400"
      />
      <CircleIcon
        v-else-if="board === TaskStatus.TODO"
        class="size-[18px] text-red-400"
      />
      <CircleDotDashedIcon
        v-else-if="board === TaskStatus.IN_PROGRESS"
        class="size-[18px] text-yellow-400"
      />
      <CircleDotIcon
        v-else-if="board === TaskStatus.IN_REVIEW"
        class="size-[18px] text-blue-400"
      />
      <CircleCheckIcon
        v-else-if="board === TaskStatus.DONE"
        class="size-[18px] text-emerald-400"
      />

      <h2 class="text-sm font-medium">
        {{ snakeCaseToTitleCase(board) }}
      </h2>
      <div
        class="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium"
      >
        {{ taskCount }}
      </div>
    </div>
    <Button @click="onOpen()" variant="ghost" size="icon" class="size-5">
      <PlusIcon class="size-4 text-neutral-500" />
    </Button>
  </div>
</template>
