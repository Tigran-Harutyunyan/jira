<script setup lang="ts">
import CreateTaskFormWrapper from "../components/CreateTaskFormWrapper.vue";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import { useCreateTaskModal } from "../store/useCreateTaskModal";

const { onClose } = useCreateTaskModal();
const { isOpen } = storeToRefs(useCreateTaskModal());
</script>

<template>
  <ResponsiveModal :open="isOpen" @openChange="onClose">
    <CreateTaskFormWrapper @close="onClose" />
  </ResponsiveModal>
</template>
