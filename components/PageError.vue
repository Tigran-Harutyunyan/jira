<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";

interface PageErrorProps {
  message: string;
}

withDefaults(defineProps<PageErrorProps>(), {
  message: "Something went wrong",
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <AlertTriangle class="size-6 text-muted-foreground mb-2" />
    <p class="text-sm font-medium text-muted-foreground">
      {{ message }}
    </p>
  </div>
</template>
