<script setup lang="ts">
import UserButton from "@/features/auth/components/UserButton.vue";
const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My Project",
    description: "View tasks of your project here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

const pathname = useRoute().fullPath;
const pathnameParts = pathname.split("/");
const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

const { title, description } = pathnameMap[pathnameKey] || defaultMap;
</script>

<template>
  <nav class="pt-4 px-6 flex items-center justify-between">
    <div class="flex-col hidden lg:flex">
      <h1 class="text-2xl font-semibold">
        {{ title }}
      </h1>
      <p class="text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <MobileSidebar />
    <UserButton />
  </nav>
</template>
