<script setup lang="ts">
import { FaCaretDown, FaCaretUp } from "vue3-icons/fa";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

const props = defineProps<AnalyticsCardProps>();

const iconColor = props.variant === "up" ? "text-emerald-500" : "text-red-500";
const increaseValueColor =
  props.variant === "up" ? "text-emerald-500" : "text-red-500";
const Icon = props.variant === "up" ? FaCaretUp : FaCaretDown;
</script>

<template>
  <Card class="shadow-none border-none w-full">
    <CardHeader>
      <div class="flex items-center gap-x-2.5">
        <CardDescription
          class="flex items-center gap-x-2 font-medium overflow-hidden"
        >
          <span class="truncate text-base">{{ title }}</span>
        </CardDescription>
        <div class="flex items-center gap-x-1">
          <component :is="Icon" :class="cn(iconColor, 'size-4')" />
          <span
            :class="cn(increaseValueColor, 'truncate text-base font-medium')"
          >
            {{ increaseValue }}
          </span>
        </div>
      </div>
      <CardTitle class="3xl font-semibold">{{ value }}</CardTitle>
    </CardHeader>
  </Card>
</template>
