<script setup lang="ts">
import UserButton from "@/features/auth/components/UserButton.vue";
import { routeMetadata, defaultMetadata } from "@/data/routeMetaData";

// Helper function to get route metadata
const getRouteMetadata = (routeName: string | null) => {
  return routeName && routeMetadata[routeName]
    ? routeMetadata[routeName]
    : defaultMetadata;
};

// Extract route information
const route = useRoute();
const { title, description } = getRouteMetadata(route.name as string);
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
