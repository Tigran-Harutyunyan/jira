<script setup lang="ts">
import { PencilIcon, XIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { type Task } from "@/features/tasks/types";

interface TaskDescriptionProps {
  task: Task;
}

const props = defineProps<TaskDescriptionProps>();

const isEditing = ref(false);
const description = ref(props.task.description);

const queryClient = useQueryClient();
const { toast, showResponseError } = useToastMessage();

const { mutate, isPending } = useMutation({
  mutationFn: (payload) =>
    $fetch(
      `/api/workspaces/${props.task.workspaceId}/tasks/${props.task.$id}`,
      {
        method: "PATCH",
        body: payload,
      }
    ),
  onSuccess: (data) => {
    if (data && "$id" in data) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", props.task.$id] });
      toast({
        title: "Task updated",
      });
    }
  },
  onError: (error) => {
    showResponseError(error);
  },
});

const handleSave = () => {
  mutate({ description: description.value });
};
</script>

<template>
  <div class="p-4 border rounded-lg">
    <div class="flex items-center justify-between">
      <p class="text-lg font-semibold">Overview</p>
      <Button @click="isEditing = !isEditing" size="sm" variant="secondary">
        <XIcon v-if="isEditing" class="size-4 mr-2" />
        <PencilIcon v-else class="size-4 mr-2" />

        {{ isEditing ? "Cancel" : "Edit" }}
      </Button>
    </div>
    <DottedSeparator class="my-4" />

    <div v-if="isEditing" class="flex flex-col gap-y-4">
      <Textarea
        placeholder="Add a description..."
        v-model="description"
        :rows="4"
        :disabled="isPending"
      />
      <Button
        size="sm"
        class="w-fit ml-auto"
        @click="handleSave"
        :disabled="isPending"
      >
        {{ isPending ? "Wait..." : "Save Changes" }}
      </Button>
    </div>

    <div v-else>
      <template v-if="task.description">
        {{ task.description }}
      </template>
      <span v-else class="text-muted-foreground"> No description set </span>
    </div>
  </div>
</template>
