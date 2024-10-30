<script setup lang="ts">
import { createSessionClient } from "@/lib/appwrite";

import { Loader, LogOut } from "lucide-vue-next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { useUIstore } from "@/stores/useUI";

const { userInfo } = storeToRefs(useUIstore());
const { setUserInfo } = useUIstore();

const queryClient = useQueryClient();

const avatarFallback = computed(() => {
  if (!userInfo.value) return "U";
  const { name, email } = userInfo.value;
  return name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";
});

const { mutate, isPending } = useMutation({
  mutationFn: () => $fetch("/api/auth/logout", { method: "POST" }),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    queryClient.invalidateQueries({ queryKey: ["current"] });
    setUserInfo(null);
    navigateTo("/sign-in");
  },
});
onBeforeMount(async () => {
  if (!userInfo.value) {
    const { account } = await createSessionClient();
    const user = await account.get();
    setUserInfo(user);
  }
});
</script>

<template>
  <div
    v-if="isPending"
    class="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300"
  >
    <Loader class="size-4 animate-spin text-muted-foreground" />
  </div>

  <DropdownMenu :modal="false" v-if="userInfo && !isPending">
    <DropdownMenuTrigger class="outline-none relative">
      <Avatar
        class="size-10 hover:opacity-75 transition border border-neutral-300"
      >
        <AvatarFallback
          class="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center"
        >
          {{ avatarFallback }}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      side="bottom"
      class="w-60"
      :sideOffset="10"
    >
      <div class="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
        <Avatar class="size-[52px] border border-neutral-300">
          <AvatarFallback
            class="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center"
          >
            {{ avatarFallback }}
          </AvatarFallback>
        </Avatar>
        <div class="flex flex-col items-center justify-center">
          <p class="text-sm font-medium text-neutral-900">
            {{ userInfo.name || "User" }}
          </p>
          <p class="text-xs text-neutral-500">{{ userInfo.email }}</p>
        </div>
      </div>
      <DottedSeparator class="mb-1" />
      <DropdownMenuItem
        @click="mutate()"
        class="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
      >
        <LogOut class="size-4 mr-2" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
