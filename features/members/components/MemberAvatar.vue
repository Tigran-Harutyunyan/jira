<script setup lang="ts">
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

defineProps<MemberAvatarProps>();
</script>

<template>
  <Avatar
    :class="
      cn('size-5 transition border border-neutral-300 rounded-full', className)
    "
  >
    <AvatarFallback
      :class="
        cn(
          'bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center',
          fallbackClassName
        )
      "
    >
      {{ name.charAt(0).toUpperCase() }}
    </AvatarFallback>
  </Avatar>
</template>
