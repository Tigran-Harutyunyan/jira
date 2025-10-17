<script setup lang="ts">
import DottedSeparator from "@/components/DottedSeparator.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useInviteCode } from "@/features/workspaces/composables/useInviteCode";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

defineProps<JoinWorkspaceFormProps>();
const router = useRouter();
const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const workspaceId = useWorkspaceId();
const inviteCode = useInviteCode();
const { toast, showResponseError } = useToastMessage();
const queryClient = useQueryClient();

const { mutate, isPending } = useMutation({
  mutationFn: (params: { workspaceId: string; inviteCode: string }) =>
    $fetch(`/api/workspace/${workspaceId}/join/${inviteCode}`, {
      method: "POST",
      body: params,
    }),
  onSuccess: (data) => {
    if (data && "workspace" in data && "$id" in data.workspace) {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspaceId", workspaceId],
      });
      toast({
        title: "Joined workspace",
      });
      router.push(`/workspaces/${data.workspace.$id}`);
    }
  },
  onError: (error) => {
    showResponseError(error);
  },
});

const onSubmit = () => {
  mutate({
    workspaceId,
    inviteCode,
  });
};
</script>

<template>
  <ConfirmDialog ref="confirm" />
  <Card class="w-full h-full border-none shadow-none">
    <CardHeader class="p-7">
      <CardTitle class="text-xl font-bold"> Join workspace </CardTitle>
      <CardDescription>
        You&apos;ve been invited to join
        <strong>{{ initialValues.name }}</strong> workspace
      </CardDescription>
    </CardHeader>
    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7">
      <div class="flex flex-col lg:flex-row gap-2 items-center justify-between">
        <Button
          variant="secondary"
          type="button"
          as-child
          size="lg"
          class="w-full lg:w-fit"
          :disabled="isPending"
        >
          <NuxtLink to="/"> Cancel </NuxtLink>
        </Button>
        <Button
          size="lg"
          class="w-full lg:w-fit"
          type="button"
          @click="onSubmit"
          :disabled="isPending"
        >
          Join Workspace
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
