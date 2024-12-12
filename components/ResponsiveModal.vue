<script setup lang="ts">
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useWindowSize } from "@vueuse/core";

const emit = defineEmits<{
  (e: "openChange"): void;
}>();

interface ResponsiveModalProps {
  open: boolean;
}

defineProps<ResponsiveModalProps>();

const { width } = useWindowSize();
const isDesktop = computed(() => width.value > 1024);

let resolvePromise: (value: PromiseLike<boolean> | boolean) => void;

const openModal = () => {
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
};

defineExpose({ openModal });
</script>

<template>
  <Dialog v-if="isDesktop" :open="open" @update:open="emit('openChange')">
    <DialogContent
      class="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]"
    >
      <slot />
    </DialogContent>
  </Dialog>

  <Drawer v-else :open="open">
    <DrawerContent>
      <div class="overflow-y-auto hide-scrollbar max-h-[85vh]">
        <slot />
      </div>
    </DrawerContent>
  </Drawer>
</template>
