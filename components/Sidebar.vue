<script setup lang="ts"></script>

<template>
  <aside class="h-full bg-neutral-100 p-4 w-full">
    <NuxtLink to="/">
      <NuxtImg src="/logo.svg" alt="logo" :width="164" :height="48" />
    </NuxtLink>
    <DottedSeparator class="my-4" />
    <WorkspaceSwitcher />
    <DottedSeparator class="my-4" />
    <Navigation />
    <DottedSeparator class="my-4" />
    <Projects />
  </aside>
</template>
