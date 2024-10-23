<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";

import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-vue-next";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { MemberRole } from "@/features/members/types";

import MemberAvatar from "@/features/members/components/MemberAvatar.vue";
// import { useDeleteMember } from "@/features/members/api/use-delete-member";
// import { useUpdateMember } from "@/features/members/api/use-update-member";
// import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const workspaceId = useWorkspaceId();
const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const queryClient = useQueryClient();
const { toast } = useToast();

const { isLoading, data: members } = useQuery({
  queryKey: ["members", workspaceId],
  queryFn: () => $fetch(`/api/workspace/${workspaceId}/members`),
});

const { mutate: updateMember, isPending: isUpdatingMember } = useMutation({
  mutationFn: (params: { role: string; memberId: string }) =>
    $fetch(`/api/workspace/${workspaceId}/members/${params.memberId}`, {
      method: "PATCH",
      body: params,
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["members"] });
    toast({
      title: "Member updated",
    });
  },
  onError: (error) => {
    toast({
      title: error.message,
    });
  },
});

const { mutate: deleteMember } = useMutation({
  mutationFn: (memberId: string) =>
    $fetch(`/api/workspace/${workspaceId}/members/${memberId}`, {
      method: "DELETE",
      body: {
        memberId,
      },
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["members"] });
    toast({
      title: "Member deleted",
    });
  },
  onError: (error) => {
    toast({
      title: error.message,
    });
  },
});

const handleUpdateMember = (memberId: string, role: MemberRole) => {
  updateMember({
    role,
    memberId,
  });
};

const handleDeleteMember = async (memberId: string) => {
  const userInput = await confirm.value?.openModal(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );

  if (!userInput) return;

  deleteMember(memberId);
};
</script>

<template>
  <Card class="w-full h-full border-none shadow-none">
    <ConfirmDialog ref="confirm" />
    <CardHeader class="flex flex-row items-center gap-x-4 p-7 space-y-0">
      <Button asChild variant="secondary" size="sm">
        <NuxtLink :to="`/workspaces/${workspaceId}`">
          <ArrowLeftIcon class="size-4 mr-2" />
          Back
        </NuxtLink>
      </Button>
      <CardTitle class="text-xl font-bold"> Members list </CardTitle>
    </CardHeader>
    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7">
      <template v-for="(member, index) in members?.documents" :key="member.$id">
        <div class="flex items-center gap-2">
          <MemberAvatar
            class="size-10"
            fallbackclass="text-lg"
            :name="member.name"
          />
          <div class="flex flex-col">
            <p class="text-sm font-medium">{{ member.name }}</p>
            <p class="text-xs text-muted-foreground">{{ member.email }}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button class="ml-auto" variant="secondary" size="icon">
                <MoreVerticalIcon class="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem
                class="font-medium"
                @click="handleUpdateMember(member.$id, MemberRole.ADMIN)"
                :disabled="isUpdatingMember"
              >
                Set as Administrator
              </DropdownMenuItem>
              <DropdownMenuItem
                class="font-medium"
                @click="handleUpdateMember(member.$id, MemberRole.MEMBER)"
                :disabled="isUpdatingMember"
              >
                Set as Member
              </DropdownMenuItem>
              <DropdownMenuItem
                class="font-medium text-amber-700"
                @click="handleDeleteMember(member.$id)"
                :disabled="isUpdatingMember"
              >
                Remove {{ member.name }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator
          v-if="index < members?.documents.length - 1"
          class="my-2.5"
        />
      </template>
    </CardContent>
  </Card>
</template>
