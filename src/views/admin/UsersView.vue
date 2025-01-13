<template>
  <div class="max-w-5xl mx-auto mt-8">
    <h1 class="text-2xl font-semibold mb-6">Users List</h1>
    <div
      v-if="users.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UserCard v-for="user in users" :key="user.id" :user="user" />
    </div>
    <div v-else class="text-center text-gray-500">No users found.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import UserCard from "@/components/common/UserCard.vue";
import { useAdminStore } from "../../store/admin";

const adminStore = useAdminStore();
const users = ref(adminStore.users);
</script>
