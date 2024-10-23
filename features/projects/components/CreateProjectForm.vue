<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { ImageIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createProjectSchema } from "@/features/projects/schemas";

const emit = defineEmits<{
  (e: "onClose"): void;
}>();

interface CreateFormProps {
  showCancel?: boolean;
}

withDefaults(defineProps<CreateFormProps>(), {
  showCancel: true,
});

const imageRef = ref<File | null>(null);
const imageSrc = ref();
const image = ref<File | null>(null);
const queryClient = useQueryClient();
const router = useRouter();
const { toast } = useToast();
const workspaceId = useWorkspaceId();

const handleImageChange = (e) => {
  const uploadedFile = (e.target as HTMLInputElement).files?.[0];

  if (uploadedFile) {
    image.value = uploadedFile;
    imageSrc.value = URL.createObjectURL(image.value);
  }
};

const form = useForm({
  initialValues: {
    name: "",
  },
  validationSchema: createProjectSchema,
});

const { mutate, isPending } = useMutation({
  mutationFn: (newProject: FormData) =>
    $fetch("/api/project", { method: "POST", body: newProject }),
  onSuccess: (data) => {
    if (data && "$id" in data && "workspaceId" in data) {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push(`/workspaces/${data.workspaceId}`);
      emit("onClose");
      toast({
        title: "Project created",
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

const onRemoveImage = () => {
  if (image.value) {
    image.value = null;
    imageSrc.value = "";
  }
};
</script>

<template>
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
            {{ isPending ? "Wait..." : "Create Project" }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
