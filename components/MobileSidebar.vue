<script setup lang="ts">
import { MenuIcon } from "lucide-vue-next";
import Sidebar from "./Sidebar.vue";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const isOpen = ref(false);

watch(
  () => useRoute().path,
  () => {
    isOpen.value = false;
  }
);
</script>

<template>
  <Sheet :modal="false" :open="isOpen" @update:open="isOpen = !isOpen">
    <SheetTrigger as-child>
      <Button variant="secondary" class="lg:hidden">
        <MenuIcon class="size-4 text-neutral-500" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="p-0">
      <Sidebar />
    </SheetContent>
  </Sheet>
</template>
