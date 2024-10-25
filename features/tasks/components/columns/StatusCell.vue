<script setup lang="ts">
import { snakeCaseToTitleCase } from "@/lib/utils";
defineProps<{
  status: string;
}>();
</script>

<template>
  <Badge :variant="status">{{ snakeCaseToTitleCase(status) }}</Badge>
</template>
