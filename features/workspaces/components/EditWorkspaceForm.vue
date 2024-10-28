<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";

import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-vue-next";
import { useForm, configure } from "vee-validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { type Workspace } from "../types";
import { updateWorkspaceSchema } from "../schemas";

configure({
  validateOnBlur: false,
});

interface EditWorkspaceFormProps {
  initialValues: Workspace;
}

const props = defineProps<EditWorkspaceFormProps>();

const emit = defineEmits<{
  (e: "onCancel"): void;
}>();

const imageRef = ref<File | null>(null);
const imageSrc = ref(props.initialValues.imageUrl);
const image = ref<File | null>(null);
const cardTitle = ref(props.initialValues.name);

const queryClient = useQueryClient();
const router = useRouter();
const { toast } = useToast();
const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const inviteCode = ref(props.initialValues.inviteCode);
const fullInviteLink = computed(
  () =>
    `${window.location.origin}/workspaces/${props.initialValues.$id}/join/${inviteCode.value}`
);

const form = useForm({
  initialValues: {
    name: props.initialValues.name,
  },
  validationSchema: updateWorkspaceSchema,
});

const { mutate, isPending } = useMutation({
  mutationFn: (workspace: FormData) =>
    $fetch(`/api/workspace/${props.initialValues.$id}`, {
      method: "PATCH",
      body: workspace,
    }),
  onSuccess: (data) => {
    if (data && "workspace" in data && "$id" in data.workspace) {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspaceId", props.initialValues.$id],
      });

      toast({
        title: "Workspace updated",
      });

      cardTitle.value = data?.workspace?.name;
    }
  },
  onError: (error) => {
    toast({
      title: error,
    });
  },
});

const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useMutation(
  {
    mutationFn: () =>
      $fetch(`/api/workspace/${props.initialValues.$id}`, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      if (data && "$id" in data) {
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspaceId", props.initialValues.$id],
        });
        toast({
          title: "Workspace deleted",
        });
        window.location.href = "/";
      }
    },
    onError: (error) => {
      toast({
        title: error,
      });
    },
  }
);

const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
  useMutation({
    mutationFn: () =>
      $fetch(`/api/workspace/${props.initialValues.$id}/reset-invite-code`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      if (data && "workspace" in data && "$id" in data.workspace) {
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        queryClient.invalidateQueries({
          queryKey: ["workspaceId", props.initialValues.$id],
        });

        inviteCode.value = data.workspace?.inviteCode;

        toast({
          title: "Workspace invite code reset",
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
  formData.append("workspaceId", props.initialValues.$id);

  if (image.value instanceof File) {
    formData.append("image", image.value);
  } else if (props.initialValues.imageUrl) {
    formData.append("image", props.initialValues.imageUrl);
  }

  mutate(formData);
});

const onRemoveImage = () => {
  if (imageRef.value) {
    imageRef.value = null;
    imageSrc.value = "";
  }
};

const onBack = () => {
  router.push(`/workspaces/${props.initialValues.$id}`);
};

const handleDelete = async () => {
  const userInput = await confirm.value?.openModal(
    "Delete Project",
    "This action cannot be undone.",
    "destructive"
  );

  if (!userInput) return;

  deleteWorkspace();
};

const handleResetInviteCode = async () => {
  const userInput = await confirm.value?.openModal(
    "Reset invite link",
    "This will invalidate the current invite link",
    "destructive"
  );

  if (!userInput) return;
  resetInviteCode();
};

const handleImageChange = (e) => {
  const uploadedFile = (e.target as HTMLInputElement).files?.[0];

  if (uploadedFile) {
    image.value = uploadedFile;
    imageSrc.value = URL.createObjectURL(image.value);
  }
};

const handleCopyInviteLink = () => {
  navigator.clipboard.writeText(fullInviteLink.value).then(() =>
    toast({
      title: "Invite link copied to clipboard",
    })
  );
};
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <ConfirmDialog ref="confirm" />
    <Card class="w-full h-full border-none shadow-none">
      <CardHeader class="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button size="sm" variant="secondary" @click="onBack()">
          <ArrowLeftIcon class="size-4 mr-2" />
          Back
        </Button>
        <CardTitle class="text-xl font-bold">
          {{ cardTitle }}
        </CardTitle>
      </CardHeader>
      <div class="px-7">
        <DottedSeparator />
      </div>
      <CardContent class="p-7">
        <form novalidate @submit.prevent.stop="onSubmit">
          <div class="flex flex-col gap-y-4">
            <FormField name="name" v-slot="{ componentField }">
              <FormItem>
                <FormLabel> Workspace Name </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="text"
                    placeholder="Enter workspace name"
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
                    <p class="text-sm">Workspace Icon</p>
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
              @click="emit('onCancel')"
              :disabled="isPending"
              class="invisible"
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

    <Card class="w-ful h-full border-none shadow-none">
      <CardContent class="p-7">
        <div class="flex flex-col">
          <h3 class="font-bold">Invite Members</h3>
          <p class="text-sm text-muted-foreground">
            Use the invite link to add members to your workspace.
          </p>
          <div class="mt-4">
            <div class="flex items-center gap-x-2">
              <Input disabled v-model="fullInviteLink" />
              <Button
                @click="handleCopyInviteLink"
                variant="secondary"
                class="size-12"
              >
                <CopyIcon class="size-5" />
              </Button>
            </div>
          </div>
          <DottedSeparator class="py-7" />
          <Button
            class="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            :disabled="isPending || isResettingInviteCode"
            @click="handleResetInviteCode"
          >
            Reset invite link
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="w-ful h-full border-none shadow-none">
      <CardContent class="p-7">
        <div class="flex flex-col">
          <h3 class="font-bold">Danger Zone</h3>
          <p class="text-sm text-muted-foreground">
            Deleting a workspace is irreversible and will remove all associated
            data.
          </p>
          <DottedSeparator class="py-7" />
          <Button
            class="mt-6 w-fit ml-auto"
            size="sm"
            variant="destructive"
            type="button"
            :disabled="isPending || isDeletingWorkspace"
            @click="handleDelete()"
          >
            Delete Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
