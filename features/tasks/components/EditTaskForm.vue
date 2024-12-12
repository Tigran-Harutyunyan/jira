<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm, configure } from "vee-validate";
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

import { TaskStatus, type Task } from "../types";
import { createTaskSchema } from "../schemas";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";

const queryClient = useQueryClient();
const projectId = useProjectId();
const workspaceId = useWorkspaceId();
const { toast } = useToast();

interface EditTaskFormProps {
  initialValues: Task;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  showCancel?: boolean;
}

const props = defineProps<EditTaskFormProps>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

configure({
  validateOnBlur: false,
});

const {
  setFieldValue,
  handleSubmit,
  validate,
  values: formValues,
} = useForm({
  initialValues: {
    name: props.initialValues.name,
    status: props.initialValues.status,
    workspaceId: props.initialValues.workspaceId,
    projectId: props.initialValues.projectId,
    assigneeId: props.initialValues.assigneeId,
    dueDate: props.initialValues?.dueDate,
  },
  validationSchema: createTaskSchema,
});

const dueDate = ref(props.initialValues?.dueDate);

const { mutate, isPending } = useMutation({
  mutationFn: (payload) =>
    $fetch(`/api/workspaces/${workspaceId}/tasks/${props.initialValues.$id}`, {
      method: "PATCH",
      body: payload,
    }),
  onSuccess: (data) => {
    if (data && "$id" in data) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });

      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project-analytics", projectId],
        });
      }

      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: ["workspace-analytics", workspaceId],
        });
      }

      emit("close");
      toast({
        title: "Task updated",
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

  let payload = {
    ...values,
    dueDate: dueDate.value,
  };

  mutate(payload);
});

const onDateChange = (date) => {
  dueDate.value = date;
  setFieldValue("dueDate", date);
};
</script>

<template>
  <Card class="w-full h-full border-none shadow-none">
    <CardHeader class="flex p-7">
      <CardTitle class="text-xl font-bold"> Edit a task </CardTitle>
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
                <DatePicker v-model="dueDate" @change="onDateChange" />
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
            @click="emit('close')"
            :disabled="isPending"
            :class="{ invisible: !showCancel }"
          >
            Cancel
          </Button>
          <Button :disabled="isPending" type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
