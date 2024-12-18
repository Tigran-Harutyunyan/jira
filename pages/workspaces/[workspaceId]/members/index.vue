<script lang="ts" setup>
definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });
useHead({
  title: "Members list",
});
import MembersList from "@/features/workspaces/components/MembersList.vue";
</script>
<template>
  <NuxtLayout name="standalone">
    <div class="w-full lg:max-w-xl">
      <MembersList />
    </div>
  </NuxtLayout>
</template>
