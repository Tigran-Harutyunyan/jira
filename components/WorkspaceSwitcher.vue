<script setup lang="ts">
import { RiAddCircleFill } from "vue3-icons/ri";
import WorkspaceAvatar from "@/features/workspaces/components/WorkspaceAvatar.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";

const workspaceId = useWorkspaceId();

const router = useRouter();

const { onOpen } = useCreateWorkspaceModal();

const { isLoading, data } = useQuery({
  queryKey: ["workspaces"],
  queryFn: async () => {
    const { data } = await $fetch("/api/workspaces");

    if (data) {
      if ("total" in data && data.total === 0) {
        navigateTo("/workspaces/create");
      } else {
        navigateTo(`/workspaces/${data?.documents[0].$id}`);
      }
    }
    console.log(data);
    return data;
  },
});

const workspaces = computed(() => data.value);

const onSelect = (id: string) => {
  router.push(`/workspaces/${id}`);
};
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="flex items-center justify-between">
      <p class="text-xs uppercase text-neutral-500">Workspaces</p>
      <RiAddCircleFill
        @click="onOpen"
        class="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
      />
    </div>
    <Select
      v-if="!isLoading && workspaces?.total"
      @update:modelValue="onSelect"
      v-bind:modelValue="workspaceId"
    >
      <SelectTrigger class="w-full bg-neutral-200 font-medium">
        <SelectValue placeholder="No workspace selected" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="workspace in workspaces?.documents"
          :key="workspace.$id"
          :value="workspace.$id"
        >
          <div class="flex justify-start items-center gap-3 font-medium">
            <WorkspaceAvatar
              :name="workspace.name"
              :image="workspace.imageUrl || ''"
            />
            <span class="truncate">{{ workspace.name }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
