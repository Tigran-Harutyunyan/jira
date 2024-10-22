<script setup lang="ts">
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

defineProps<WorkspaceAvatarProps>();
</script>

<template>
  <div
    v-if="image"
    :class="cn('size-8 relative rounded-md overflow-hidden', className)"
  >
    <NuxtImg :src="image" :alt="name" fill class="object-cover" />
  </div>
  <Avatar v-else :class="cn('size-8 rounded-md', className)">
    <AvatarFallback
      class="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md"
    >
      {{ name[0] }}
    </AvatarFallback>
  </Avatar>
</template>
