<template>
  <div class="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ user.email }}</h2>
    <div class="grid grid-cols-1 gap-4">
      <div class="flex justify-between">
        <span class="text-gray-600">User ID:</span>
        <span class="font-semibold text-gray-800">{{ user.id }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Role:</span>
        <span class="font-semibold text-gray-800">{{ user.role }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Created At:</span>
        <span class="font-semibold text-gray-800">{{ formattedDate }}</span>
      </div>
      <div v-if="user.kycs.length === 0" class="text-sm text-gray-500 mt-2">
        No KYC records
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils/helpers.js';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const formattedDate = formatDate(props.user.createdAt);
</script>
