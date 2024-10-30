import { defineStore } from "pinia";
import { TaskStatus } from "@/features/tasks/types";

export const useCreateTaskModal = defineStore("create-task-modal", () => {
    const isOpen = ref(false);
    const newTaskStatus = ref<TaskStatus | null>(null);

    function onOpen(status?: TaskStatus) {
        isOpen.value = true;
        if (status && Object.keys(TaskStatus).includes(status)) {
            newTaskStatus.value = status;
        }
    }

    function onClose() {
        isOpen.value = false;
        newTaskStatus.value = null;
    }

    return {
        newTaskStatus,
        isOpen,
        onOpen,
        onClose,
    };
});