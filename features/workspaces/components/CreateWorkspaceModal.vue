<script setup lang="ts">
import CreateWorkspaceForm from "../components/CreateWorkspaceForm.vue";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import { useCreateWorkspaceModal } from "../store/useCreateWorkspaceModal";

const { onClose } = useCreateWorkspaceModal();
const { isOpen } = storeToRefs(useCreateWorkspaceModal());
</script>

<template>
  <ResponsiveModal :open="isOpen" @onOpenChange="onClose">
    <CreateWorkspaceForm @onClose="onClose" />
  </ResponsiveModal>
</template>
