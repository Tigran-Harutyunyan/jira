<script lang="ts" setup>
definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });
import CreateWorkspaceForm from "@/features/workspaces/components/CreateWorkspaceForm.vue";
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  </NuxtLayout>
</template>
