<script setup lang="ts">
import PageLoader from "@/components/PageLoader.vue";
import PageError from "@/components/PageError.vue";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";
import { PencilIcon } from "lucide-vue-next";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";
import { type Project } from "@/features/projects/types";

const workspaceId = useWorkspaceId();
const projectId = useProjectId();

const analytics = null;

const { isLoading, data: initialValues } = useQuery<Project>({
  queryKey: ["project", projectId],
  queryFn: async () =>
    $fetch(`/api/workspace/${workspaceId}/projects/${projectId}`),
});

const project = computed(() => {
  return initialValues.value && "project" in initialValues.value
    ? initialValues.value.project
    : null;
});
</script>

<template>
  <NuxtLayout name="dashboard">
    <PageError
      v-if="!initialValues && !isLoading"
      message="Project not found"
    />
    <PageLoader v-if="isLoading" />
    <div
      v-if="project && !isLoading && initialValues"
      class="flex flex-col gap-y-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <ProjectAvatar
            :name="project?.name"
            :image="project?.imageUrl"
            className="size-8"
          />
          <p class="text-lg font-semibold">{{ project?.name }}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <NuxtLink
              :to="`/workspaces/${project?.workspaceId}/projects/${project?.$id}/settings`"
            >
              <PencilIcon class="size-4 mr-2" />
              Edit Project
            </NuxtLink>
          </Button>
        </div>
      </div>

      <!-- <Analytics v-if="analytics" :data="analytics" />
      <TaskViewSwitcher hideProjectFilter /> -->
    </div>
  </NuxtLayout>
</template>
