<script setup lang="ts">
import MemberAvatar from "@/features/members/components/MemberAvatar.vue";
defineProps<{
  assignee: {
    name: string;
  };
}>();
</script>

<template>
  <div class="flex items-center gap-x-2 text-sm font-medium">
    <MemberAvatar
      class="size-6"
      fallbackClassName="text-xs"
      :name="assignee.name"
    />
    <p class="line-clamp-1">{{ assignee.name }}</p>
  </div>
</template>
