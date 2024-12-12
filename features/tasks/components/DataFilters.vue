<script setup lang="ts">
import { format } from "date-fns";

import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-vue-next";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";
import DatePicker from "@/components/DatePicker.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TaskStatus } from "@/features/tasks/types";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

defineProps<DataFiltersProps>();
const emit = defineEmits<{
  (e: "change", data: any): void;
}>();

const workspaceId = useWorkspaceId();
const status = ref();
const assigneeId = ref();
const projectId = ref(useProjectId());
const dueDate = ref();

const { data: projects, isLoading: isLoadingProjects } = useQuery({
  queryKey: ["projects", workspaceId],
  queryFn: async () => await $fetch(`/api/workspace/${workspaceId}/projects`),
});

const { data: members, isLoading: isLoadingMembers } = useQuery({
  queryKey: ["members", workspaceId],
  queryFn: async () => await $fetch(`/api/workspace/${workspaceId}/members`),
});

const projectOptions = computed(() => {
  if (
    projects.value &&
    "projects" in projects.value &&
    "documents" in projects.value.projects &&
    Array.isArray(projects.value.projects.documents)
  ) {
    return projects.value?.projects.documents.map((project) => ({
      value: project.$id,
      label: project.name,
    }));
  }
  return [];
});

const memberOptions = computed(() => {
  if (
    members.value &&
    "documents" in members.value &&
    Array.isArray(members.value.documents)
  ) {
    return members.value?.documents.map((member) => ({
      value: member.$id,
      label: member.name,
    }));
  }
  return [];
});

const isLoading = computed(
  () => isLoadingMembers.value || isLoadingProjects.value
);

const onStatusChange = (value: string) => {
  status.value = value === "all" ? null : (value as TaskStatus);
  update();
};

const onAssigneeChange = (value: string) => {
  assigneeId.value = value === "all" ? null : value;
  update();
};

const onProjectChange = (value: string) => {
  projectId.value = value === "all" ? null : value;
  update();
};

const isEqual = (originalDate: Date, newDate: Date) => {
  if (!originalDate || !newDate) return false;
  return (
    originalDate.getDate() === newDate.getDate() &&
    originalDate.getMonth() === newDate.getMonth() &&
    originalDate.getFullYear() === newDate.getFullYear()
  );
};

const onDateChange = (newDate: Date) => {
  dueDate.value = isEqual(dueDate.value, newDate) ? "" : newDate;
  update();
};

const update = () => {
  let payload = {
    assigneeId: assigneeId.value,
    status: status.value,
    projectId: projectId.value,
  };

  if (dueDate.value) {
    payload.dueDate = format(dueDate.value, "yyyy-MM-dd");
  }

  emit("change", payload);
};
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2">
    <Select
      :defaultValue="status ?? undefined"
      @update:modelValue="onStatusChange"
    >
      <SelectTrigger class="w-full lg:w-auto h-8">
        <div class="flex items-center pr-2">
          <ListChecksIcon class="size-4 mr-2" />
          <SelectValue placeholder="All statuses" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectSeparator />
        <SelectItem :value="TaskStatus.BACKLOG">Backlog</SelectItem>
        <SelectItem :value="TaskStatus.IN_PROGRESS">In Progress</SelectItem>
        <SelectItem :value="TaskStatus.IN_REVIEW">In Review</SelectItem>
        <SelectItem :value="TaskStatus.TODO">Todo</SelectItem>
        <SelectItem :value="TaskStatus.DONE">Done</SelectItem>
      </SelectContent>
    </Select>
    <Select
      :defaultValue="assigneeId ?? undefined"
      @update:modelValue="(value) => onAssigneeChange(value)"
    >
      <SelectTrigger class="w-full lg:w-auto h-8">
        <div class="flex items-center pr-2">
          <UserIcon class="size-4 mr-2" />
          <SelectValue placeholder="All assignees" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All assignees</SelectItem>
        <SelectSeparator />
        <SelectItem
          v-for="member in memberOptions"
          :key="member.value"
          :value="member.value"
        >
          {{ member.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select
      v-if="!hideProjectFilter"
      :defaultValue="projectId ?? undefined"
      @update:modelValue="onProjectChange"
    >
      <SelectTrigger class="w-full lg:w-auto h-8">
        <div class="flex items-center pr-2">
          <FolderIcon class="size-4 mr-2" />
          <SelectValue placeholder="All projects" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All projects</SelectItem>
        <SelectSeparator />

        <SelectItem
          v-for="project in projectOptions"
          :key="project.value"
          :value="project.value"
        >
          {{ project.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <DatePicker
      placeholder="Due date"
      className="h-8 w-full lg:w-auto"
      :value="dueDate"
      @change="onDateChange"
    />
  </div>
</template>
