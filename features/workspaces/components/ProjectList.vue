<script setup lang="ts">
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { type Project } from "@/features/projects/types";
import { useCreateProjectModal } from "@/features/projects/store/useCreateProjectModal";
import { PlusIcon } from "lucide-vue-next";

interface ProjectListProps {
  data: Project[];
  total: number;
}

defineProps<ProjectListProps>();

const workspaceId = useWorkspaceId();
const { onOpen } = useCreateProjectModal();
</script>

<template>
  <div class="flex flex-col gap-y-4 col-span-1">
    <div class="bg-white border rounded-lg p-4">
      <div class="flex items-center justify-between">
        <p class="text-lg font-semibold">Projects ({{ total }})</p>
        <Button variant="secondary" size="icon" @click="onOpen()">
          <PlusIcon class="size-4 text-neutral-400" />
        </Button>
      </div>
      <DottedSeparator class="my-4" />
      <ul v-if="data?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <li v-for="project in data" :key="project.$id">
          <NuxtLink :to="`/workspaces/${workspaceId}/projects/${project.$id}`">
            <Card class="shadow-none rounded-lg hover:opacity-75 transition">
              <CardContent class="p-4 flex items-center gap-x-2.5">
                <ProjectAvatar
                  className="size-12"
                  fallbackclassName="text-lg"
                  :name="project.name"
                  :image="project.imageUrl"
                />
                <p class="text-lg font-medium truncate">
                  {{ project.name }}
                </p>
              </CardContent>
            </Card>
          </NuxtLink>
        </li>
      </ul>
      <span
        v-else
        class="text-sm text-muted-foreground text-center hidden first-of-type:block"
      >
        No projects found
      </span>
    </div>
  </div>
</template>
