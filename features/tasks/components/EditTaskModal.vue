<script setup lang="ts">
import EditTaskFormWrapper from "../components/EditTaskFormWrapper.vue";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import { useEditTaskModal } from "../store/useEditTaskModal";

const { onClose } = useEditTaskModal();
const { isOpen, taskId } = storeToRefs(useEditTaskModal());
</script>

<template>
  <ResponsiveModal :open="isOpen" @onOpenChange="onClose">
    <EditTaskFormWrapper @onClose="onClose" :id="taskId" />
  </ResponsiveModal>
</template>
