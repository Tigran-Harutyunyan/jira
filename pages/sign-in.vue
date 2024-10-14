<script setup lang="ts">
import SignInCard from "@/features/auth/components/SignInCard.vue";
useHead({
  title: "Sign-in",
});
</script>

<template>
  <NuxtLayout name="auth">
    <SignInCard />
  </NuxtLayout>
</template>
