<script setup lang="ts">
import { Loader, PlusIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";
import { useCreateTaskModal } from "@/features/tasks/store/useCreateTaskModal";
import DataTable from "@/features/tasks/components/DataTable.vue";
import ColumnHeader from "@/features/tasks/components/columns/ColumnHeader.vue";
import ProjectCell from "@/features/tasks/components/columns/ProjectCell.vue";
import AssigneeCell from "@/features/tasks/components/columns/AssigneeCell.vue";
import TaskDateCell from "@/features/tasks/components/columns/TaskDateCell.vue";
import StatusCell from "@/features/tasks/components/columns/StatusCell.vue";
import ActionsCell from "@/features/tasks/components/columns/ActionsCell.vue";
import DataFilters from "@/features/tasks/components/DataFilters.vue";
import DataKanban from "@/features/tasks/components/DataKanban.vue";
import DataCalendar from "@/features/tasks/components/DataCalendar.vue";
import {
  type Task,
  type TaskFilters,
  type TaskStatus,
  type TaskTabValue,
  TASK_VIEW_TABS,
} from "@/features/tasks/types";
import { type ColumnDef } from "@tanstack/vue-table";
import { useUIstore } from "@/stores/useUI";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

defineProps<TaskViewSwitcherProps>();

const { onOpen } = useCreateTaskModal();
const workspaceId = useWorkspaceId();
const projectId = useProjectId();
const filters = ref<TaskFilters>();
const { toast, showResponseError } = useToastMessage();

const { taskViewTab } = storeToRefs(useUIstore());
const { setTaskViewTab } = useUIstore();

const view = ref(taskViewTab.value);

const updateFilters = (data: TaskFilters) => {
  filters.value = data;
};

const {
  data,
  isLoading: isLoadingTasks,
  refetch,
} = useQuery({
  queryKey: [
    "tasks",
    JSON.stringify(filters.value) + filters.value?.projectId || projectId,
  ],
  queryFn: async () => {
    const queries = { ...filters.value };
    queries.projectId = queries.projectId || projectId;

    const data = await $fetch(`/api/workspaces/${workspaceId}/tasks`, {
      query: queries,
    });

    return data;
  },
});

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(ColumnHeader, {
        text: "Task Name",
        onClick: () => {
          column.toggleSorting(column.getIsSorted() === "asc");
        },
      }),
    cell: ({ row }) =>
      h("p", { class: ["line-clamp-1"], innerHTML: row.original.name }),
  },
  {
    accessorKey: "project",
    header: ({ column }) =>
      h(ColumnHeader, {
        text: "Project",
        onClick: () => {
          column.toggleSorting(column.getIsSorted() === "asc");
        },
      }),
    cell: ({ row }) => h(ProjectCell, { project: row.original.project }),
  },
  {
    accessorKey: "assignee",
    header: ({ column }) =>
      h(ColumnHeader, {
        text: "Assignee",
        onClick: () => {
          column.toggleSorting(column.getIsSorted() === "asc");
        },
      }),
    cell: ({ row }) => h(AssigneeCell, { assignee: row.original.assignee }),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) =>
      h(ColumnHeader, {
        text: "Due Date",
        onClick: () => {
          column.toggleSorting(column.getIsSorted() === "asc");
        },
      }),
    cell: ({ row }) => h(TaskDateCell, { value: row.original.dueDate }),
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h(ColumnHeader, {
        text: "Status",
        onClick: () => {
          column.toggleSorting(column.getIsSorted() === "asc");
        },
      }),
    cell: ({ row }) => h(StatusCell, { status: row.original.status }),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(ActionsCell, {
        id: row.original.$id,
        projectId: row.original.projectId,
        isKanbanCard: false,
      }),
  },
];

watch(
  () => filters.value,
  () => refetch()
);

const { mutate: bulkUpdate } = useMutation({
  mutationFn: (
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) =>
    $fetch("/api/bulk-update", {
      method: "POST",
      body: {
        tasks: JSON.stringify(tasks),
        workspaceId,
      },
    }),
  onError: (error) => {
    showResponseError(error);
  },
});

const onKanbanChange = (
  tasks: { $id: string; status: TaskStatus; position: number }[]
) => {
  bulkUpdate(tasks);
};

const onTabChange = (tab: TaskTabValue) => {
  setTaskViewTab(tab);
};
</script>

<template>
  <div
    v-if="isLoadingTasks"
    class="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center"
  >
    <Loader class="size-5 animate-spin text-muted-foreground" />
  </div>
  <Tabs
    v-else
    :defaultValue="view"
    @update:modelValue="onTabChange"
    class="flex-1 w-full border rounded-lg"
  >
    <div class="h-full flex flex-col overflow-auto p-4">
      <div
        class="flex flex-col gap-y-2 lg:flex-row justify-between items-center"
      >
        <TabsList class="w-full lg:w-auto">
          <TabsTrigger class="h-8 w-full lg:w-auto" value="table">
            Table
          </TabsTrigger>
          <TabsTrigger class="h-8 w-full lg:w-auto" value="kanban">
            Kanban
          </TabsTrigger>
          <TabsTrigger class="h-8 w-full lg:w-auto" value="calendar">
            Calendar
          </TabsTrigger>
        </TabsList>
        <Button @click="onOpen()" size="sm" class="w-full lg:w-auto">
          <PlusIcon class="size-4 mr-2" />
          New
        </Button>
      </div>
      <DottedSeparator class="my-4" />
      <DataFilters
        :hideProjectFilter="hideProjectFilter"
        @change="updateFilters"
      />
      <DottedSeparator class="my-4" />

      <TabsContent :value="TASK_VIEW_TABS.TABLE" class="mt-0">
        <DataTable :columns="columns" :data="data ?? []" />
      </TabsContent>
      <TabsContent :value="TASK_VIEW_TABS.KANBAN" class="mt-0">
        <DataKanban @change="onKanbanChange" :data="data ?? []" />
      </TabsContent>
      <TabsContent :value="TASK_VIEW_TABS.CALENDAR" class="mt-0 h-full pb-4">
        <DataCalendar :data="data ?? []" />
      </TabsContent>
    </div>
  </Tabs>
</template>
