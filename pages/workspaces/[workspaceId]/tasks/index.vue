<script lang="ts" setup>
definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher.vue";
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  </NuxtLayout>
</template>
