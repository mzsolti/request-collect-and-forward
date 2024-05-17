<script setup>
const props = defineProps({
  emptyText: { type: String, require: false, default: "" },
});
</script>
<template>
  <div class="flex flex-wrap justify-center items-center py-3">
    <div
      class="text-center border border-dashed border-gray-400 w-full p-4 md:w-1/2 m-auto rounded"
    >
      <span class="italic">{{
        props.emptyText != "" ? props.emptyText : $t("No items in list")
      }}</span>
      <slot />
    </div>
  </div>
</template>
