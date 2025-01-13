<template>
  <div class="w-full max-w-sm mx-auto">
    <div class="flex items-center justify-start mb-4">
      <router-link
        to="/auth/login"
        class="mr-4 text-gray-600 bg-gray-200 rounded-full p-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="size-4 text-black"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </router-link>
      <h2 class="text-2xl font-semibold text-gray-800">Register</h2>
    </div>

    <form @submit.prevent="handleSubmit">
      <AppInput
        v-model="formData.firstName"
        label="First Name"
        required
        placeholder="Enter your first name"
        :error="errors.firstName"
      />

      <AppInput
        v-model="formData.lastName"
        label="Last Name"
        required
        placeholder="Enter your last name"
        :error="errors.lastName"
      />

      <AppInput
        v-model="formData.email"
        label="Email"
        type="email"
        required
        placeholder="Enter your email"
        :error="errors.email"
      />

      <AppInput
        v-model="formData.password"
        label="Password"
        type="password"
        required
        placeholder="Enter your password"
        :error="errors.password"
      />

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-600 mb-1">Role</label>
        <select
          v-model="formData.role"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-gray-600 focus:ring-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <AppButton variant="primary" :loading="loading" :disabled="loading">
        Register
      </AppButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../store/auth";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";

const authStore = useAuthStore();

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "user",
});

const errors = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const loading = ref(false);

const handleSubmit = async () => {
  errors.value = {};

  if (!formData.value.firstName) {
    errors.value.firstName = "First name is required";
  }
  if (!formData.value.lastName) {
    errors.value.lastName = "Last name is required";
  }
  if (!formData.value.email) {
    errors.value.email = "Email is required";
  }
  if (!formData.value.password) {
    errors.value.password = "Password is required";
  }

  if (Object.values(errors.value).some((error) => error)) return;
  loading.value = true;
  try {
    await authStore.register(formData.value);
    console.log("User registered successfully");
  } catch (error) {
    console.error("Registration failed", error);
  } finally {
    loading.value = false;
  }
};
</script>
