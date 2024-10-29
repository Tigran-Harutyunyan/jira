<script setup>
import { Button } from "~/components/ui/button";
definePageMeta({ layout: "auth" });
useHead({
  title: "Jira | 404",
});
</script>

<template>
  <div class="min-h-screen">
    <div
      class="w-full lmd:w-1/2 relative pb-12 lg:pb-0 flex items-center justify-center h-screen"
    >
      <div class="relative flex items-center flex-col space-y-8">
        <div class="mb-12 mx-auto">
          <img src="https://i.ibb.co/G9DC8S0/404-2.png" class="mx-auto" />
        </div>
        <NuxtLink to="/" class="mx-auto">
          <Button variant="primary">BACK TO HOMEPAGE</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
