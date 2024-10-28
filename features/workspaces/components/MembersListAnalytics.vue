<script setup lang="ts">
import { type Member } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { SettingsIcon } from "lucide-vue-next";
import MemberAvatar from "@/features/members/components/MemberAvatar.vue";
interface MembersListProps {
  data: Member[];
  total: number;
}

defineProps<MembersListProps>();

const workspaceId = useWorkspaceId();
</script>

<template>
  <div class="flex flex-col gap-y-4 col-span-1">
    <div class="bg-white border rounded-lg p-4">
      <div class="flex items-center justify-between">
        <p class="text-lg font-semibold">Members ({{ total }})</p>
        <Button as-child variant="secondary" size="icon">
          <NuxtLink :to="`/workspaces/${workspaceId}/members`">
            <SettingsIcon class="size-4 text-neutral-400" />
          </NuxtLink>
        </Button>
      </div>
      <DottedSeparator class="my-4" />
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <li v-for="member in data" :key="member.$id">
          <Card class="shadow-none rounded-lg overflow-hidden">
            <CardContent class="p-3 flex flex-col items-center gap-x-2">
              <MemberAvatar className="size-12" :name="member.name" />
              <div class="flex flex-col items-center overflow-hidden">
                <p class="text-lg font-medium line-clamp-1">
                  {{ member.name }}
                </p>
                <p class="text-sm text-muted-foreground line-clamp-1">
                  {{ member.email }}
                </p>
              </div>
            </CardContent>
          </Card>
        </li>
        <li
          class="text-sm text-muted-foreground text-center hidden first-of-type:block"
        >
          No members found
        </li>
      </ul>
    </div>
  </div>
</template>
