<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { ImageIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { type Project } from "@/features/projects/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { updateProjectSchema } from "@/features/projects/schemas";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { useProjectId } from "@/features/projects/composables/useProjectId";

const emit = defineEmits<{
  (e: "onClose"): void;
}>();

interface EditFormProps {
  initialValues: Project;
  showCancel?: boolean;
}

const props = withDefaults(defineProps<EditFormProps>(), {
  showCancel: false,
});

const imageRef = ref<File | null>(null);
const imageSrc = ref(props.initialValues.imageUrl);
const image = ref<File | null>(null);
const queryClient = useQueryClient();
const router = useRouter();
const { toast } = useToast();
const workspaceId = useWorkspaceId();
const projectId = useProjectId();
const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const handleImageChange = (e) => {
  const uploadedFile = (e.target as HTMLInputElement).files?.[0];

  if (uploadedFile) {
    image.value = uploadedFile;
    imageSrc.value = URL.createObjectURL(image.value);
  }
};

const form = useForm({
  initialValues: {
    name: props.initialValues.name,
  },
  validationSchema: updateProjectSchema,
});

const { mutate, isPending } = useMutation({
  mutationFn: (project: FormData) =>
    $fetch(`/api/workspace/${workspaceId}/projects/${projectId}`, {
      method: "PATCH",
      body: project,
    }),
  onSuccess: (data) => {
    if (data && "project" in data && "$id" in data.project) {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.project.$id],
      });
      toast({
        title: "Project updated",
      });
    }
  },
  onError: (error) => {
    toast({
      title: error,
    });
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  if (!values.name) return;

  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("workspaceId", workspaceId);

  if (image.value instanceof File) {
    formData.append("image", image.value);
  }

  mutate(formData);
});

const { mutate: deleteProject, isPending: isDeletingProject } = useMutation({
  mutationFn: () =>
    $fetch(`/api/workspace/${workspaceId}/projects/${projectId}`, {
      method: "DELETE",
    }),
  onSuccess: (data) => {
    debugger;
    if (data && "$id" in data) {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", props.initialValues.$id],
      });
      toast({
        title: "Project is deleted",
      });
      router.push(`/workspaces/${workspaceId}`);
    }
  },
  onError: (error) => {
    toast({
      title: error,
    });
  },
});

const handleDelete = async () => {
  const userInput = await confirm.value?.openModal(
    "Delete Project",
    "This action cannot be undone.",
    "destructive"
  );

  if (!userInput) return;

  deleteProject();
};

const onRemoveImage = () => {
  if (image.value) {
    image.value = null;
    imageSrc.value = "";
  }
};
</script>

<template>
  <ConfirmDialog ref="confirm" />
  <Card class="w-full h-full border-none shadow-none">
    <CardHeader class="flex p-7">
      <CardTitle class="text-xl font-bold"> Create a new project </CardTitle>
    </CardHeader>
    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7">
      <form novalidate @submit.prevent="onSubmit">
        <div class="flex flex-col gap-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel> Project Name </FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="text"
                  placeholder="Enter project name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="image">
            <div class="flex flex-col gap-y-2">
              <div class="flex items-center gap-x-5">
                <div
                  v-if="imageSrc"
                  class="size-[72px] relative rounded-md overflow-hidden"
                >
                  <NuxtImg
                    alt="Logo"
                    fill
                    class="object-cover"
                    :src="imageSrc"
                  />
                </div>

                <Avatar v-else class="size-[72px]">
                  <AvatarFallback>
                    <ImageIcon class="size-[36px] text-neutral-400" />
                  </AvatarFallback>
                </Avatar>

                <div class="flex flex-col">
                  <p class="text-sm">Project Icon</p>
                  <p class="text-sm text-muted-foreground">
                    JPG, PNG, SVG or JPEG, max 1mb
                  </p>
                  <input
                    class="hidden"
                    type="file"
                    accept=".jpg, .png, .jpeg, .svg"
                    ref="imageRef"
                    @change="handleImageChange"
                    @click="
                      imageRef = null;
                      imageSrc = '';
                    "
                    :disabled="isPending"
                  />

                  <Button
                    v-if="imageSrc"
                    type="button"
                    :disabled="isPending"
                    variant="destructive"
                    size="xs"
                    class="w-fit mt-2"
                    @click="onRemoveImage()"
                  >
                    Remove Image
                  </Button>

                  <Button
                    v-else
                    type="button"
                    :disabled="isPending"
                    variant="teritary"
                    size="xs"
                    class="w-fit mt-2"
                    @click="imageRef?.click()"
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          </FormField>
        </div>
        <DottedSeparator class="py-7" />
        <div class="flex items-center justify-between">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            @click="emit('onClose')"
            :disabled="isPending"
            :class="{ invisible: !showCancel }"
          >
            Cancel
          </Button>
          <Button :disabled="isPending" type="submit" size="lg">
            {{ isPending ? "Wait..." : "Update Project" }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
  <DottedSeparator class="py-7" />
  <Card class="w-ful h-full border-none shadow-none">
    <CardContent class="p-7">
      <div class="flex flex-col">
        <h3 class="font-bold">Danger Zone</h3>
        <p class="text-sm text-muted-foreground">
          Deleting a project is irreversible and will remove all associated
          data.
        </p>
        <DottedSeparator class="py-7" />
        <Button
          class="mt-6 w-fit ml-auto"
          size="sm"
          variant="destructive"
          type="button"
          :disabled="isPending || isDeletingProject"
          @click="handleDelete"
        >
          Delete Project
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
