<script setup lang="ts">
import CreateProjectForm from "@/features/projects/components/CreateProjectForm.vue";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import { useCreateProjectModal } from "@/features/projects/store/useCreateProjectModal";

const { onClose } = useCreateProjectModal();
const { isOpen } = storeToRefs(useCreateProjectModal());
</script>

<template>
  <ResponsiveModal :open="isOpen" @openChange="onClose">
    <CreateProjectForm @close="onClose" />
  </ResponsiveModal>
</template>
