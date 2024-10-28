<script setup lang="ts">
import { type Member } from "@/features/members/types";
import { type Project } from "@/features/projects/types";
import MemberAvatar from "@/features/members/components/MemberAvatar.vue";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";

const workspaceId = useWorkspaceId();

interface EventCardProps {
  title: string;
  assignee: Member;
  project: Project;
  status: TaskStatus;
  id: string;
}
const props = defineProps<EventCardProps>();

const statusColorMap = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

const router = useRouter();

const onClick = () => {
  router.push(`/workspaces/${workspaceId}/tasks/${props.id}`);
};
</script>

<template>
  <div class="px-2">
    <div
      @click="onClick"
      :class="
        cn(
          'p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition',
          statusColorMap[status]
        )
      "
    >
      <p>{{ title }}</p>
      <div class="flex items-center gap-x-1">
        <MemberAvatar :name="assignee?.name" />
        <div class="size-1 rounded-full bg-neutral-300" />
        <ProjectAvatar :name="project?.name" :image="project?.imageUrl" />
      </div>
    </div>
  </div>
</template>
