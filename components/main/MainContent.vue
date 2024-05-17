<script setup lang="ts">
const props = defineProps({
  title: String,
});
import ConfirmDialog from "primevue/confirmdialog";
</script>
<template>
  <div class="card w-full">
    <div
      class="flex bg-white border border-gray-400 rounded p-1 items-center w-full mb-3"
    >
      <h1 class="text-xl font-bold text-black dark:text-white w-3/6 md:w-2/6">
        {{ props.title }}
      </h1>
      <div class="w-3/6 md:w-4/6 flex justify-end items-center">
        <slot name="title-right" />
      </div>
    </div>
    <slot />
    <div class="p-2 text-center">
      <slot name="content-bottom" />
    </div>
    <Toast position="bottom-right"></Toast>
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>
