<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  auth: { guestRedirectUrl: "/sign-in" },
});
</script>
<template>
  <NuxtLayout name="dashboard"> </NuxtLayout>
</template>
