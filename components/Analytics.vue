<script setup lang="ts">
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnalyticsCard from "./AnalyticsCard.vue";
import DottedSeparator from "./DottedSeparator.vue";

interface ProjectAnalyticsResponseType {
  data: {
    taskCount: number;
    taskDifference: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    completedTaskCount: number;
    completedTaskDifference: number;
    incompleteTaskCount: number;
    incompleteTaskDifference: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
  };
}

defineProps<ProjectAnalyticsResponseType>();
</script>

<template>
  <ScrollArea class="border rounded-lg w-full whitespace-nowrap shrink-0">
    <div class="w-full flex flex-row">
      <div class="flex items-center flex-1">
        <AnalyticsCard
          title="Total tasks"
          :value="data.taskCount"
          :variant="data.taskDifference > 0 ? 'up' : 'down'"
          :increaseValue="data.taskDifference"
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div class="flex items-center flex-1">
        <AnalyticsCard
          title="Assigned Tasks"
          :value="data.assignedTaskCount"
          :variant="data.assignedTaskDifference > 0 ? 'up' : 'down'"
          :increaseValue="data.assignedTaskDifference"
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div class="flex items-center flex-1">
        <AnalyticsCard
          title="Completed Tasks"
          :value="data.completedTaskCount"
          :variant="data.completedTaskDifference > 0 ? 'up' : 'down'"
          :increaseValue="data.completedTaskDifference"
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div class="flex items-center flex-1">
        <AnalyticsCard
          title="Overdue Tasks"
          :value="data.overdueTaskCount"
          :variant="data.overdueTaskDifference > 0 ? 'up' : 'down'"
          :increaseValue="data.overdueTaskDifference"
        />
        <DottedSeparator direction="vertical" />
      </div>
      <div class="flex items-center flex-1">
        <AnalyticsCard
          title="Incomplete Tasks"
          :value="data.incompleteTaskCount"
          :variant="data.incompleteTaskDifference > 0 ? 'up' : 'down'"
          :increaseValue="data.incompleteTaskDifference"
        />
        <DottedSeparator direction="vertical" />
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>
