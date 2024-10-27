<script setup lang="ts">
import CreateWorkspaceModal from "@/features/workspaces/components/CreateWorkspaceModal.vue";
import CreateProjectModal from "@/features/projects/components/CreateProjectModal.vue";
import CreateTaskModal from "@/features/tasks/components/CreateTaskModal.vue";
import EditTaskModal from "@/features/tasks/components/EditTaskModal.vue";
</script>

<template>
  <ClientOnly>
    <CreateWorkspaceModal />
    <CreateProjectModal />
    <CreateTaskModal />
    <EditTaskModal />
    <div class="min-h-screen">
      <div class="flex w-full h-full">
        <div
          class="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto"
        >
          <Sidebar />
        </div>
        <div class="lg:pl-[264px] w-full">
          <div class="mx-auto max-w-screen-2xl h-full">
            <NavBar />
            <main class="h-full py-8 px-6 flex flex-col">
              <slot />
            </main>
          </div>
        </div>
      </div></div
  ></ClientOnly>
</template>
