<template>
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="spinner-border animate-spin border-t-4 border-b-4 border-white w-16 h-16 rounded-full"
      ></div>
    </div>
  </template>
  
  <script setup>
  import isLoading from "@/composables/loadingState";
  </script>
  
  <style scoped>
  .spinner-border {
    border-top-color: transparent;
    border-right-color: transparent;
    border-left-color: transparent;
  }
  </style>
  