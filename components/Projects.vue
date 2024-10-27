<script setup lang="ts">
import { RiAddCircleFill } from "vue3-icons/ri";
import { useCreateProjectModal } from "@/features/projects/store/useCreateProjectModal";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { cn } from "@/lib/utils";

const { onOpen } = useCreateProjectModal();
const workspaceId = useWorkspaceId();

const { data } = useQuery({
  queryKey: ["projects", workspaceId],
  queryFn: async () => await $fetch(`/api/workspace/${workspaceId}/projects`),
});

const projects = computed(() => {
  if (
    data.value &&
    "projects" in data.value &&
    "documents" in data.value.projects
  ) {
    const pathname = useRoute().params?.projectId;
    return data.value?.projects?.documents.map((project) => {
      const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
      const isActive = pathname === project.$id;
      return {
        ...project,
        href,
        isActive,
      };
    });
  }
  return [];
});
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex items-center justify-between">
      <p class="text-xs uppercase text-neutral-500">Projects</p>
      <RiAddCircleFill
        @click="onOpen()"
        class="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
      />
    </div>

    <NuxtLink v-for="project in projects" :to="project.href" :key="project.$id">
      <div
        :class="
          cn(
            'flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500',
            project.isActive &&
              'bg-white shadow-sm hover:opacity-100 text-primary'
          )
        "
      >
        <ProjectAvatar :image="project.imageUrl" :name="project.name" />
        <span class="truncate">{{ project.name }}</span>
      </div>
    </NuxtLink>
  </div>
</template>
