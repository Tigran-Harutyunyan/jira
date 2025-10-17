<script setup lang="ts">
import { useForm, configure } from "vee-validate";
import { useRouter } from "vue-router";
import { useQueryClient, useMutation } from "@tanstack/vue-query";
import { createProjectSchema } from "@/features/projects/schemas";
import { useWorkspaceId } from "@/features/workspaces/composables/useWorkspaceId";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-vue-next";

configure({ validateOnBlur: false });

const emit = defineEmits<{ (e: "close"): void }>();
const { toast, showResponseError } = useToastMessage();
const workspaceId = useWorkspaceId();
const router = useRouter();
const queryClient = useQueryClient();

const image = ref<File | null>(null);
const imageSrc = ref<string | null>();

const handleImageChange = (e: Event) => {
  const uploadedFile = (e.target as HTMLInputElement).files?.[0];
  if (uploadedFile) {
    image.value = uploadedFile;
    imageSrc.value = URL.createObjectURL(uploadedFile);
  }
};

const form = useForm({
  initialValues: { name: "" },
  validationSchema: createProjectSchema,
});

const { mutate } = useMutation({
  mutationFn: (newProject: FormData) => {
    return $fetch("/api/project", { method: "POST", body: newProject });
  },
  onSuccess: (data) => {
    if (data && "$id" in data && "workspaceId" in data) {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      router.push(`/workspaces/${data.workspaceId}`);
      emit("close");
      toast({
        title: "Project created",
        description: "Your project has been successfully created.",
      });
    }
  },
  onError: (error) => {
    showResponseError(error);
  },
});

const onSubmit = form.handleSubmit((values) => {
  if (!values.name) return;

  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("workspaceId", workspaceId);
  if (image.value) formData.append("image", image.value);
  mutate(formData);
});

const onRemoveImage = () => {
  image.value = null;
  imageSrc.value = null;
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
                    ref="image"
                    @change="handleImageChange"
                    @click="
                      image = null;
                      imageSrc = null;
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
                    @click="image?.click()"
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
            @click="emit('close')"
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
