<script setup lang="ts">
import EditTaskFormWrapper from "@/features/tasks/components/EditTaskFormWrapper.vue";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import { useEditTaskModal } from "@/features/tasks/store/useEditTaskModal";

const { onClose } = useEditTaskModal();
const { isOpen, taskId } = storeToRefs(useEditTaskModal());
</script>

<template>
  <ResponsiveModal :open="isOpen" @openChange="onClose">
    <EditTaskFormWrapper @close="onClose" :id="taskId" />
  </ResponsiveModal>
</template>
