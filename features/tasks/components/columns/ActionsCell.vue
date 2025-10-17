<script setup lang="ts">
import {
  ExternalLinkIcon,
  PencilIcon,
  MoreHorizontal,
  TrashIcon,
  MoreVertical,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditTaskModal } from "@/features/tasks/store/useEditTaskModal";

const { onOpen } = useEditTaskModal();

interface TaskActionsProps {
  id: string;
  projectId: string;
  isKanbanCard: boolean;
}

const props = defineProps<TaskActionsProps>();

const workspaceId = useWorkspaceId();
const projectId = useProjectId();
const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const router = useRouter();
const { toast, showResponseError } = useToastMessage();
const queryClient = useQueryClient();

const { mutate, isPending } = useMutation({
  mutationFn: () =>
    $fetch(`/api/workspaces/${workspaceId}/tasks/${props.id}`, {
      method: "DELETE",
    }),
  onSuccess: (data) => {
    if (data.$id) {
      toast({
        title: "Task deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });

      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project-analytics", projectId],
        });
      }

      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: ["workspace-analytics", workspaceId],
        });
      }
    }
  },
  onError: (error) => {
    showResponseError(error);
  },
});

const onDelete = async () => {
  const userInput = await confirm.value?.openModal(
    "Delete task",
    "This action cannot be undone.",
    "destructive"
  );

  if (!userInput) return;

  mutate();
};

const onOpenTask = () => {
  router.push(`/workspaces/${workspaceId}/tasks/${props.id}`);
};

const onOpenProject = () => {
  router.push(`/workspaces/${workspaceId}/projects/${props.projectId}`);
};
</script>

<template>
  <div class="flex justify-end">
    <ConfirmDialog ref="confirm" />
    <DropdownMenu :modal="false">
      <DropdownMenuTrigger as-child>
        <MoreHorizontal
          v-if="isKanbanCard"
          class="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition cursor-pointer"
        />

        <Button v-else variant="ghost" class="size-8 p-0">
          <MoreVertical class="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-48">
        <DropdownMenuItem @click="onOpenTask" class="font-medium p-[10px]">
          <ExternalLinkIcon class="size-4 mr-2 stroke-2" />
          Task Details
        </DropdownMenuItem>
        <DropdownMenuItem @click="onOpenProject" class="font-medium p-[10px]">
          <ExternalLinkIcon class="size-4 mr-2 stroke-2" />
          Open Project
        </DropdownMenuItem>
        <DropdownMenuItem @click="onOpen(id)" class="font-medium p-[10px]">
          <PencilIcon class="size-4 mr-2 stroke-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem
          @click="onDelete"
          :disabled="isPending"
          class="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
        >
          <TrashIcon class="size-4 mr-2 stroke-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
