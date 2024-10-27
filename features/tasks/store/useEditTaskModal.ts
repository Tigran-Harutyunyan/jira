import { defineStore } from "pinia";

export const useEditTaskModal = defineStore("edit-task-modal", () => {
    const isOpen = ref(false);
    const taskId = ref();

    function onOpen(id: string) {
        taskId.value = id;
        isOpen.value = true;
    }

    function onClose() {
        isOpen.value = false;
    }

    return {
        taskId,
        isOpen,
        onOpen,
        onClose,
    };
});