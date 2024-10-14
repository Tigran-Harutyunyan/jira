<script setup lang="ts">
import SignUpCard from "@/features/auth/components/SignUpCard.vue";
useHead({
  title: "Sign-up",
});
</script>

<template>
  <NuxtLayout name="auth">
    <SignUpCard />
  </NuxtLayout>
</template>
