<script setup lang="ts">
import PageLoader from "@/components/PageLoader.vue";
import PageError from "@/components/PageError.vue";
import EditProjectForm from "@/features/projects/components/EditProjectForm.vue";

import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";
import { type Project } from "@/features/projects/types";

const workspaceId = useWorkspaceId();
const projectId = useProjectId();

const { isLoading, data: initialValues } = useQuery<Project>({
  queryKey: ["project", projectId],
  queryFn: async () =>
    $fetch(`/api/workspace/${workspaceId}/projects/${projectId}`),
});
</script>

<template>
  <NuxtLayout name="standalone">
    <PageError
      v-if="!initialValues && !isLoading"
      message="Project not found"
    />
    <PageLoader v-if="isLoading" />

    <div v-if="initialValues && !isLoading" class="w-full lg:max-w-xl">
      <EditProjectForm :initialValues="initialValues?.project" />
    </div>
  </NuxtLayout>
</template>
