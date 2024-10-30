<script setup lang="ts">
import PageLoader from "@/components/PageLoader.vue";
import PageError from "@/components/PageError.vue";
import EditProjectForm from "@/features/projects/components/EditProjectForm.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";
import { type Project } from "@/features/projects/types";
import { ArrowLeftIcon } from "lucide-vue-next";
const workspaceId = useWorkspaceId();
const projectId = useProjectId();

const { isLoading, data: initialValues } = useQuery<Project>({
  queryKey: ["project", projectId],
  queryFn: async () =>
    $fetch(`/api/workspace/${workspaceId}/projects/${projectId}`),
});

const onBack = () => {
  navigateTo(`/workspaces/${workspaceId}/projects/${projectId}`);
};
</script>

<template>
  <NuxtLayout name="standalone">
    <PageError
      v-if="!initialValues && !isLoading"
      message="Project not found"
    />
    <PageLoader v-if="isLoading" />

    <div v-if="initialValues && !isLoading" class="w-full lg:max-w-xl">
      <Button size="sm" variant="secondary" @click="onBack()" class="mb-5">
        <ArrowLeftIcon class="size-4 mr-2" />
        Back
      </Button>

      <EditProjectForm :initialValues="initialValues?.project" />
    </div>
  </NuxtLayout>
</template>
