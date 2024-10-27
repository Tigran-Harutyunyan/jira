<script setup lang="ts">
import { Button } from "@/components/ui/button";
import ResponsiveModal from "@/components/ResponsiveModal.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// To show the confirm modal
const showConfirm = ref(false);
// Resolve promise function
let resolvePromise: (value: PromiseLike<boolean> | boolean) => void;

const confirmTitle = ref<null | string>(null);
const confirmMessage = ref<null | string>(null);
const buttonVariant = ref("primary");

const openModal = (title: string, message: string, variant = "primary") => {
  confirmTitle.value = title;
  confirmMessage.value = message;
  buttonVariant.value = variant;
  showConfirm.value = true;
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
};

const handleUserInput = (value: boolean) => {
  if (!resolvePromise) return;
  resolvePromise(value);
  showConfirm.value = false;
};

defineExpose({ openModal });
</script>

<template>
  <ResponsiveModal :open="showConfirm" @onOpenChange="handleUserInput(false)">
    <Card class="w-full h-full border-none shadow-none">
      <CardContent class="pt-8">
        <CardHeader class="p-0">
          <CardTitle>{{ confirmTitle }}</CardTitle>
          <CardDescription>{{ confirmMessage }}</CardDescription>
        </CardHeader>
        <div
          class="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end"
        >
          <Button
            @click="handleUserInput(false)"
            variant="outline"
            class="w-full lg:w-auto"
          >
            Cancel
          </Button>
          <Button
            @click="handleUserInput(true)"
            :variant="buttonVariant"
            class="w-full lg:w-auto"
          >
            Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  </ResponsiveModal>
</template>
