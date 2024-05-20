<script setup lang="ts">
import { useSlots } from "vue";
const props = defineProps({
  title: { type: String, required: false, default: "" },
});
const slots = useSlots();
</script>
<template>
  <div
    class="bg-white border rounded border-gray-400 p-1 mb-2 items-center w-full"
  >
    <div v-if="slots['title-right']" class="flex">
      <h2
        class="text-xl font-bold text-black dark:text-white pb-0 mb-2 pl-2 w-1/2"
      >
        {{ props.title }}
      </h2>
      <div class="w-1/2 flex items-center justify-end">
        <slot name="title-right" />
      </div>
    </div>
    <div v-else>
      <h2 class="text-xl font-bold text-black dark:text-white pb-0 mb-2 pl-2">
        {{ props.title }}
      </h2>
    </div>
    <div class="p-2">
      <slot />
    </div>
  </div>
</template>
