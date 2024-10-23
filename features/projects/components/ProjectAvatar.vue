<script setup lang="ts">
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

defineProps<ProjectAvatarProps>();
</script>

<template>
  <div
    v-if="image"
    :class="cn('size-5 relative rounded-md overflow-hidden', className)"
  >
    <NuxtImg :src="image" :alt="name" fill className="object-cover" />
  </div>

  <Avatar v-else :class="cn('size-5 rounded-md', className)">
    <AvatarFallback
      :class="
        cn(
          'text-white bg-blue-600 font-semibold text-sm uppercase rounded-md',
          fallbackClassName
        )
      "
    >
      {{ name[0] }}
    </AvatarFallback>
  </Avatar>
</template>
