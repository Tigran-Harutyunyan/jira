<script setup lang="ts">
interface OverviewPropertyProps {
  label: string;
}
defineProps<OverviewPropertyProps>();
</script>

<template>
  <div class="flex items-start gap-x-2">
    <div class="min-w-[100px]">
      <p class="text-sm text-muted-foreground">
        {{ label }}
      </p>
    </div>
    <div class="flex items-center gap-x-2">
      <slot />
    </div>
  </div>
</template>
