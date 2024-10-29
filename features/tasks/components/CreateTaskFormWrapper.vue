<script setup lang="ts">
import { Loader } from "lucide-vue-next";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import CreateTaskForm from "@/features/tasks/components/CreateTaskForm.vue";

const emit = defineEmits<{
  (e: "onClose"): void;
}>();

const workspaceId = useWorkspaceId();

const { data: projects, isLoading: isLoadingProjects } = useQuery({
  queryKey: ["projects", workspaceId],
  queryFn: async () => await $fetch(`/api/workspace/${workspaceId}/projects`),
});

const { data: members, isLoading: isLoadingMembers } = useQuery({
  queryKey: ["members", workspaceId],
  queryFn: async () => await $fetch(`/api/workspace/${workspaceId}/members`),
});

const projectOptions = computed(() => {
  if (
    projects.value &&
    "projects" in projects.value &&
    "documents" in projects.value.projects &&
    Array.isArray(projects.value.projects.documents)
  ) {
    return projects.value?.projects.documents.map((project) => ({
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
    }));
  }
  return [];
});

const memberOptions = computed(() => {
  if (
    members.value &&
    "documents" in members.value &&
    Array.isArray(members.value.documents)
  ) {
    return members.value?.documents.map((project) => ({
      id: project.$id,
      name: project.name,
    }));
  }
  return [];
});

const isLoading = computed(
  () => isLoadingMembers.value || isLoadingProjects.value
);
</script>

<template>
  <Card v-if="isLoading" class="w-full h-[714px] border-none shadow-none">
    <CardContent class="flex items-center justify-center h-full">
      <Loader class="size-5 animate-spin text-muted-foreground" />
    </CardContent>
  </Card>
  <CreateTaskForm
    v-else
    :projectOptions="projectOptions ?? []"
    :memberOptions="memberOptions ?? []"
    :showCancel="true"
    @onClose="emit('onClose')"
  />
</template>
