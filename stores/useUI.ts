import { defineStore } from "pinia";
import { type TaskTabValue, TASK_VIEW_TABS } from "@/features/tasks/types";

export const useUIstore = defineStore("use-ui-store", () => {
    const taskViewTab = ref<TaskTabValue>(TASK_VIEW_TABS.TABLE);
    const userInfo = ref();

    function setTaskViewTab(tab: TaskTabValue) {
        taskViewTab.value = tab;
    }

    function setUserInfo(info) {
        userInfo.value = info;
    }

    return {
        taskViewTab,
        userInfo,
        setTaskViewTab,
        setUserInfo
    };
});