<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { type Task } from "@/features/tasks/types";
import CalendarEventCard from "./CalendarEventCard.vue";

interface DataCalendarProps {
  data: Task[];
}

const props = defineProps<DataCalendarProps>();

const events = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return [];
  return props.data.map((task: Task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));
});

const calendarOptions = computed(() => {
  return {
    plugins: [dayGridPlugin, multiMonthPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth multiMonthYear",
    },
    initialView: "dayGridMonth",
    multiMonthMaxColumns: 1,
    eventSources: [
      {
        events: events.value,
      },
    ],
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
  };
});

const fullCalendar = ref(null);
//Method for interacting with component
// let calendarApi = ref();
// calendarApi.value = fullCalendar.value?.getApi();
onMounted(() => {
  window.dispatchEvent(new Event("resize"));
});
</script>

<template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions">
    <template v-slot:eventContent="arg">
      <CalendarEventCard
        :id="arg.event.id"
        :title="arg.event.title"
        :assignee="arg.event.extendedProps.assignee"
        :project="arg.event.extendedProps.project"
        :status="arg.event.extendedProps.status"
      />
    </template>
  </FullCalendar>
</template>
