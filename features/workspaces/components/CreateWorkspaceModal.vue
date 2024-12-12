<script setup lang="ts">
import CreateWorkspaceForm from "@/features/workspaces/components/CreateWorkspaceForm.vue";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";

const { onClose } = useCreateWorkspaceModal();
const { isOpen } = storeToRefs(useCreateWorkspaceModal());
</script>

<template>
  <ResponsiveModal :open="isOpen" @openChange="onClose">
    <CreateWorkspaceForm @close="onClose" />
  </ResponsiveModal>
</template>
