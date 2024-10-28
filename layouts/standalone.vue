<script setup lang="ts">
import UserButton from "@/features/auth/components/UserButton.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
const workspaceId = useWorkspaceId();
</script>

<template>
  <main class="bg-neutral-100 min-h-screen">
    <div class="mx-auto max-w-screen-2xl p-4">
      <nav class="flex justify-between items-center h-[73px]">
        <NuxtLink :to="`/workspaces/${workspaceId}`">
          <NuxtImg src="/logo.svg" alt="Logo" :height="56" :width="152" />
        </NuxtLink>
        <UserButton />
      </nav>
      <div class="flex flex-col items-center justify-center py-4">
        <slot />
      </div>
    </div>
  </main>
</template>
