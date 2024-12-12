<script setup lang="ts">
import { Container, Draggable } from "vue3-smooth-dnd";
import KanbanCard from "./KanbanCard.vue";
import KanbanColumnHeader from "./KanbanColumnHeader.vue";
import { type Task, TaskStatus } from "../types";

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
}

type TasksToUpdate = { $id: string; status: TaskStatus; position: number }[];

const props = defineProps<DataKanbanProps>();
const { data: RawTasks } = toRefs(props);

const emit = defineEmits<{
  (e: "change", tasks: TasksToUpdate): void;
}>();

let tasks = ref();

watch(
  () => RawTasks.value,
  (newVal) => {
    if (!newVal || !Array.isArray(newVal)) return;
    console.log("new tasks", newVal);
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    newVal.forEach((task: Task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    tasks.value = newTasks;
  },
  {
    immediate: true,
  }
);

const isloading = ref(false);

const getCardPayload = (board: TaskStatus) => {
  return (index: number) => {
    return markRaw(
      tasks.value[board].filter((p: Task) => p.status === board)[index]
    );
  };
};

const onCardDrop = (
  sourceStatus: TaskStatus,
  dragResult: {
    addedIndex: number;
    removedIndex: number;
    payload: Task;
  }
) => {
  const { addedIndex, removedIndex, payload } = dragResult;

  if (addedIndex === null && removedIndex === null) return;

  if (!tasks.value[sourceStatus]) return;

  const newTasks = { ...tasks.value };

  let updatesPayload: {
    $id: string;
    status: TaskStatus;
    position: number;
  }[] = [];

  const sourceColumn = [...tasks.value[sourceStatus]];

  let updatedMovedTask = payload;

  if (removedIndex !== null) {
    updatedMovedTask = sourceColumn.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    if (updatedMovedTask) {
      updatedMovedTask.status = sourceStatus;

      updatesPayload.push({
        $id: updatedMovedTask.$id,
        status: sourceStatus,
        position: Math.min((addedIndex + 1) * 1000, 1_000_000),
      });

      sourceColumn.splice(addedIndex, 0, updatedMovedTask);
    }
  }

  sourceColumn.forEach((task: Task, index: number) => {
    if (task && task.$id !== updatedMovedTask.$id) {
      const newPosition = Math.min((index + 1) * 1000, 1_000_000);
      if (task.position !== newPosition) {
        updatesPayload.push({
          $id: task.$id,
          status: sourceStatus,
          position: newPosition,
        });
      }
    }
  });

  newTasks[sourceStatus] = sourceColumn.map((task: Task) => {
    return {
      ...task,
      status: sourceStatus,
    };
  });

  if (updatesPayload.length) {
    emit("change", updatesPayload);
  }

  tasks.value = { ...newTasks };
};
</script>

<template>
  <Container v-if="tasks" group-name="cols" tag="div" orientation="horizontal">
    <div class="flex overflow-x-auto">
      <Draggable
        v-for="board in boards"
        :key="board"
        class="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
      >
        <KanbanColumnHeader
          v-if="tasks && tasks[board]"
          :board="board"
          :task-count="tasks[board]?.length"
        />
        <Container
          group-name="col-items"
          :get-child-payload="getCardPayload(board)"
          :shouldAcceptDrop="(e) => e.groupName === 'col-items' && !isloading"
          :drop-placeholder="{
            className: `bg-slate-200 bg-opacity-20  
            border-dotted border-2 
            border-primary rounded-lg mx-4 my-2`,
            animationDuration: '200',
            showOnTop: true,
          }"
          drag-class="bg-slate-200   
            border-2 border-primary-hover text-white 
            transition duration-100 ease-in z-50
            transform rotate-6 scale-110"
          drop-class="transition duration-100 
            ease-in z-50 transform 
            -rotate-2 scale-90"
          @drop="(e) => onCardDrop(board, e)"
        >
          <Draggable
            v-for="(task, index) in tasks[board]"
            :key="task?.$id"
            :index="index"
          >
            <KanbanCard :task="task" />
          </Draggable>
        </Container>
      </Draggable>
    </div>
  </Container>
</template>
<style scoped>
.smooth-dnd-container {
  min-height: 100%;
}
</style>
