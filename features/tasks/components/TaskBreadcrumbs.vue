<script setup lang="ts">
import { ChevronRightIcon, TrashIcon } from "lucide-vue-next";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { type Project } from "@/features/projects/types";
import { type Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useToast } from "@/components/ui/toast/use-toast";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

const props = defineProps<TaskBreadcrumbsProps>();

const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const workspaceId = useWorkspaceId();
const { toast } = useToast();
const queryClient = useQueryClient();

const { mutate, isPending } = useMutation({
  mutationFn: () =>
    $fetch(`/api/workspaces/${workspaceId}/tasks/${props.task.$id}`, {
      method: "DELETE",
    }),
  onSuccess: (data) => {
    if (data && "$id" in data) {
      const router = useRouter();
      toast({
        title: "Task deleted",
      });

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      router.push(
        `/workspaces/${workspaceId}/projects/${props.task.projectId}`
      );
    }
  },
});

const handleDeleteTask = async () => {
  const userInput = await confirm.value?.openModal(
    "Delete task",
    "This action cannot be undone.",
    "destructive"
  );

  if (!userInput) return;

  mutate();
};
</script>

<template>
  <div class="flex items-center gap-x-2">
    <ConfirmDialog ref="confirm" />
    <ProjectAvatar
      :name="project.name"
      :image="project.imageUrl"
      class="size-6 lg:size-8"
    />
    <NuxtLink :to="`/workspaces/${workspaceId}/projects/${project.$id}`">
      <p
        class="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition"
      >
        {{ project.name }}
      </p>
    </NuxtLink>
    <ChevronRightIcon class="size-4 lg:size-5 text-muted-foreground" />
    <p class="text-sm lg:text-lg font-semibold">
      {{ task.name }}
    </p>
    <Button
      @click="handleDeleteTask"
      :disabled="isPending"
      class="ml-auto"
      variant="destructive"
      size="sm"
    >
      <TrashIcon class="size-4 lg:mr-2" />
      <span class="hidden lg:block">Delete Task</span>
    </Button>
  </div>
</template>
