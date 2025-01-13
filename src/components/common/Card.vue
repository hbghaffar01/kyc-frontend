<template>
  <div
    class="bg-white p-4 shadow-lg rounded-lg border border-gray-200 w-[250px] text-center"
  >
    <h2 class="text-xl font-semibold mb-4 text-gray-800">{{ heading }}</h2>
    <span class="font-semibold text-teal-400">{{ value }}</span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  heading: String,
  value: String,
});
</script>
