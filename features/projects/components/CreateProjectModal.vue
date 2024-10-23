<script setup lang="ts">
import CreateProjectForm from "../components/CreateProjectForm.vue";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import { useCreateProjectModal } from "../store/useCreateProjectModal";

const { onClose } = useCreateProjectModal();
const { isOpen } = storeToRefs(useCreateProjectModal());
</script>

<template>
  <ResponsiveModal :open="isOpen" @onOpenChange="onClose">
    <CreateProjectForm @onClose="onClose" />
  </ResponsiveModal>
</template>
