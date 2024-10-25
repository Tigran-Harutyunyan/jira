<script setup lang="ts">
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";
defineProps<{
  project: {
    name: string;
    imageUrl: string;
  };
}>();
</script>

<template>
  <div class="flex items-center gap-x-2 text-sm font-medium">
    <ProjectAvatar
      class="size-6"
      :name="project.name"
      :image="project.imageUrl"
    />
    <p class="line-clamp-1">{{ project.name }}</p>
  </div>
</template>
