<script setup lang="ts">
import { Button } from "@/components/ui/button";

const isSignIn = computed(() => useRoute().path === "/sign-in");
</script>

<template>
  <main class="bg-neutral-100 min-h-screen">
    <div class="mx-auto max-w-screen-2xl p-4">
      <nav class="flex justify-between items-center">
        <NuxtImg src="/logo.svg" alt="logo" width="152" height="56" />
        <Button as-child variant="secondary">
          <NuxtLink :to="isSignIn ? '/sign-up' : '/sign-in'">
            {{ isSignIn ? "Sign Up" : "Login" }}
          </NuxtLink>
        </Button>
      </nav>
      <div class="flex flex-col items-center justify-center pt-4 md:pt-14">
        <slot />
      </div>
    </div>
  </main>
</template>
