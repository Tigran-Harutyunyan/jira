<script lang="ts" setup>
definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });
import CreateWorkspaceForm from "@/features/workspaces/components/CreateWorkspaceForm.vue";
</script>

<template>
  <NuxtLayout name="standalone">
    <div class="w-full lg:max-w-xl">
      <CreateWorkspaceForm :show-cancel="false" />
    </div>
  </NuxtLayout>
</template>
