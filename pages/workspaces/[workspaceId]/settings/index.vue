<script lang="ts" setup>
definePageMeta({ middleware: "auth", auth: { guestRedirectUrl: "/sign-in" } });

import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import EditWorkspaceForm from "@/features/workspaces/components/EditWorkspaceForm.vue";
import PageLoader from "@/components/PageLoader.vue";
import PageError from "@/components/PageError.vue";

const workspaceId = useWorkspaceId();

const {
  isLoading,
  data: initialValues,
  isError,
} = useQuery({
  queryKey: ["workspace", workspaceId],
  queryFn: async () => $fetch(`/api/workspace/${workspaceId}`),
});

const workspace = computed(() => {
  return initialValues.value && "workspace" in initialValues.value
    ? initialValues.value.workspace
    : null;
});
</script>

<template>
  <NuxtLayout name="standalone">
    <PageError
      v-if="!initialValues && !isLoading"
      message="Project not found"
    />
    <PageLoader v-if="isLoading" />
    <div class="w-full lg:max-w-xl" v-if="workspace && !isLoading">
      <EditWorkspaceForm :initial-values="workspace" />
    </div>
  </NuxtLayout>
</template>
