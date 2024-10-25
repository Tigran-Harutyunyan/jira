<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/DatePicker.vue";
import DottedSeparator from "@/components/DottedSeparator.vue";
import MemberAvatar from "@/features/members/components/MemberAvatar.vue";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TaskStatus } from "../types";
import { createTaskSchema } from "../schemas";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";

const queryClient = useQueryClient();
const workspaceId = useWorkspaceId();
const { toast } = useToast();

interface CreateTaskFormProps {
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  showCancel?: boolean;
}

defineProps<CreateTaskFormProps>();

const emit = defineEmits<{
  (e: "onCancel"): void;
}>();

const {
  setFieldValue,
  handleSubmit,
  validate,
  values: formValues,
} = useForm({
  initialValues: {
    workspaceId,
  },
  validationSchema: createTaskSchema,
});

const dueDate = ref();

const onDateChange = (date) => {
  dueDate.value = date;
  const { year, month, day } = dueDate.value;
  setFieldValue("dueDate", new Date(year, month - 1, day));
};

const { mutate, isPending } = useMutation({
  mutationFn: (payload) =>
    $fetch("/api/task", { method: "POST", body: payload }),
  onSuccess: (data) => {
    if (data && "$id" in data) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      emit("onCancel");
      toast({
        title: "Task created",
      });
    }
  },
  onError: (error) => {
    toast({
      title: error,
    });
  },
});

const onSubmit = handleSubmit(async (values) => {
  if (!validate()) return;
  mutate(formValues);
});
</script>

<template>
  <Card class="w-full h-full border-none shadow-none">
    <CardHeader class="flex p-7">
      <CardTitle class="text-xl font-bold"> Create a new task </CardTitle>
    </CardHeader>
    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7">
      <form novalidate @submit.prevent="onSubmit">
        <div class="flex flex-col gap-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel> Task Name </FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="text"
                  placeholder="Enter task name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="dueDate" v-slot="{ componentField }">
            <FormItem>
              <FormLabel> Due Date </FormLabel>
              <FormControl>
                <DatePicker :value="dueDate" @onChange="onDateChange" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="assigneeId" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      v-for="member in memberOptions"
                      :key="member.id"
                      :value="member.id"
                    >
                      <div class="flex items-center gap-x-2">
                        <MemberAvatar class="size-6" :name="member.name" />
                        {{ member.name }}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="status" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem :value="TaskStatus.BACKLOG">
                      Backlog
                    </SelectItem>
                    <SelectItem :value="TaskStatus.IN_PROGRESS">
                      In Progress
                    </SelectItem>
                    <SelectItem :value="TaskStatus.IN_REVIEW">
                      In Review
                    </SelectItem>
                    <SelectItem :value="TaskStatus.TODO">Todo</SelectItem>
                    <SelectItem :value="TaskStatus.DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="projectId" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      v-for="project in projectOptions"
                      :key="project.id"
                      :value="project.id"
                    >
                      <div class="flex items-center gap-x-2">
                        <ProjectAvatar
                          class="size-6"
                          :name="project.name"
                          :image="project.imageUrl"
                        />
                        {{ project.name }}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DottedSeparator class="py-7" />
        <div class="flex items-center justify-between">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            @click="emit('onCancel')"
            :disabled="isPending"
            :class="{ invisible: !showCancel }"
          >
            Cancel
          </Button>
          <Button :disabled="isPending" type="submit" size="lg">
            Create Task
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
