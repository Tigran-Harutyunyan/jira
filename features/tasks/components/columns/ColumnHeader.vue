<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-vue-next";
defineProps<{
  text: string;
}>();
</script>

<template>
  <Button variant="ghost">
    {{ text }}
    <ArrowUpDown class="ml-2 h-4 w-4" />
  </Button>
</template>
