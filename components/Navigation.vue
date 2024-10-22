<script setup lang="ts">
import { SettingsIcon, UsersIcon } from "lucide-vue-next";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "vue3-icons/go";

const workspaceId = useRoute().params.workspaceId;

const pathname = useRoute().path;

import { cn } from "@/lib/utils";

const routes = computed(() => {
  return [
    {
      label: "Home",
      href: "",
      icon: GoHome,
      activeIcon: GoHomeFill,
    },
    {
      label: "My Tasks",
      href: "/tasks",
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
    },
    {
      label: "Members",
      href: "/members",
      icon: UsersIcon,
      activeIcon: UsersIcon,
    },
  ].map((item) => {
    const fullHref = `/workspaces/${workspaceId}${item.href}`;
    const isActive = pathname === fullHref;
    const Icon = isActive ? item.activeIcon : item.icon;
    return {
      ...item,
      icon: Icon,
      isActive,
      fullHref,
    };
  });
});
</script>

<template>
  <ul class="flex flex-col" v-if="workspaceId">
    <NuxtLink v-for="item in routes" :key="item.href" :to="item.fullHref">
      <div
        :class="
          cn(
            'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
            item.isActive && 'bg-white shadow-sm hover:opacity-100 text-primary'
          )
        "
      >
        <component :is="item.icon" class="size-5 text-neutral-500" />
        {{ item.label }}
      </div>
    </NuxtLink>
  </ul>
</template>
