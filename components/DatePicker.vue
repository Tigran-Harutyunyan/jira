<script setup lang="ts">
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  className?: string;
  placeholder?: string;
  withMinDate?: boolean;
}

const value = defineModel<Date | string>();

defineProps<DatePickerProps>();

const isOpen = ref(false);

const emit = defineEmits<{
  (e: "change", date: any): void;
}>();
</script>

<template>
  <Popover :open="isOpen" @update:open="isOpen = !isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="lg"
        :class="
          cn(
            'w-full justify-start text-left font-normal px-3',
            !value && 'text-muted-foreground',
            className
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value">
          {{ format(value, "MMMM dd, yyyy") }}
        </template>
        <span v-else>{{ placeholder }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <VDatePicker
        :minDate="new Date()"
        v-model="value"
        @dayclick="
          (data) => {
            isOpen = false;
            emit('change', data.date);
          }
        "
      >
      </VDatePicker>
    </PopoverContent>
  </Popover>
</template>
