<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
  auth: { guestRedirectUrl: "/sign-in" },
});

useHead({
  title: "Home | Monitor all of your projects and tasks",
});

import PageLoader from "@/components/PageLoader.vue";
import PageError from "@/components/PageError.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { type Project } from "@/features/projects/types";
import { type Task } from "@/features/tasks/types";
import { type Member } from "@/features/members/types";
import Analytics from "@/components/Analytics.vue";
import ProjectList from "@/features/workspaces/components/ProjectList.vue";
import TaskList from "@/features/workspaces/components/TaskList.vue";
import MembersListAnalytics from "@/features/workspaces/components/MembersListAnalytics.vue";

const workspaceId = useWorkspaceId();

const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
  queryKey: ["workspace-analytics", workspaceId],
  queryFn: async () => $fetch(`/api/workspace/${workspaceId}/analytics`),
});

const { data: projects, isLoading: isLoadingProjects } = useQuery<Project>({
  queryKey: ["projects", workspaceId],
  queryFn: async () => $fetch(`/api/workspace/${workspaceId}/projects`),
});

const { data: tasks, isLoading: isLoadingTasks } = useQuery<Task>({
  queryKey: ["tasks-analytics", workspaceId],
  queryFn: async () => $fetch(`/api/workspaces/${workspaceId}/tasks`),
});

const { data: members, isLoading: isLoadingMembers } = useQuery<Member>({
  queryKey: ["members-analytics", workspaceId],
  queryFn: async () => $fetch(`/api/workspace/${workspaceId}/members`),
});

const isLoading = computed(() => {
  return (
    isLoadingAnalytics.value ||
    isLoadingTasks.value ||
    isLoadingProjects.value ||
    isLoadingMembers.value
  );
});
</script>

<template>
  <NuxtLayout name="dashboard">
    <PageLoader v-if="isLoading" />

    <template v-else>
      <PageError
        v-if="!analytics || !tasks || !projects || !members"
        message="Failed to load workspace data"
      />

      <div v-else class="h-full flex flex-col space-y-4">
        <Analytics v-if="analytics" :data="analytics" />
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <TaskList :data="tasks" :total="tasks?.length" />
          <ProjectList
            v-if="projects?.projects"
            :data="projects?.projects.documents"
            :total="projects?.projects.total"
          />
          <MembersListAnalytics
            :data="members?.documents"
            :total="members?.documents.length"
          />
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>
