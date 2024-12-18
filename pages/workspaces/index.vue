<script lang="ts" setup>
definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });
useHead({
  title: "Home",
});
</script>

<template>
  <NuxtLayout name="dashboard"> </NuxtLayout>
</template>
