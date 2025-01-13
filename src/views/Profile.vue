<template>
  <div
    class="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200"
  >
    <h1 class="text-2xl font-semibold mb-6 text-gray-800">Your Profile</h1>
    <div class="grid grid-cols-1 gap-6">
      <div class="flex justify-between">
        <span class="text-gray-600 font-bold">User ID:</span>
        <span class="font-semibold text-gray-800">{{ userProfile?.id }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600 font-bold">Email:</span>
        <span class="font-semibold text-gray-800">{{ userProfile?.email }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600 font-bold">Name:</span>
        <span class="font-semibold text-gray-800">{{ userProfile?.name }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600 font-bold">Role:</span>
        <span class="font-semibold text-gray-800">{{ userProfile?.role }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600 font-bold">Created At:</span>
        <span class="font-semibold text-gray-800">{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const userProfile = ref(authStore.profile);

const formattedDate = computed(() => {
  const date = new Date(authStore.userProfile?.createdAt);
  return date.toLocaleString();
});
</script>
