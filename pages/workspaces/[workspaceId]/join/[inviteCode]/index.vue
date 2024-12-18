<script lang="ts" setup>
definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });
useHead({
  title: "Join workspace",
});
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import JoinWorkspaceForm from "@/features/workspaces/components/JoinWorkspaceForm.vue";
import PageLoader from "@/components/PageLoader.vue";
import PageError from "@/components/PageError.vue";

const workspaceId = useWorkspaceId();

const {
  isLoading,
  data: initialValues,
  isError,
} = useQuery({
  queryKey: ["workspace", workspaceId],
  queryFn: async () => $fetch(`/api/workspace/${workspaceId}/info`),
});
</script>

<template>
  <NuxtLayout name="standalone">
    <PageError
      v-if="(!initialValues && !isLoading) || isError"
      message="Project not found"
    />
    <PageLoader v-if="isLoading" />
    <div class="w-full lg:max-w-xl" v-if="initialValues && !isLoading">
      <JoinWorkspaceForm :initial-values="initialValues" />
    </div>
  </NuxtLayout>
</template>
