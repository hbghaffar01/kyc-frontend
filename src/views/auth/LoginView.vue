<template>
  <div class="w-full max-w-sm mx-auto">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Login</h2>

    <form @submit.prevent="handleSubmit">
      <AppInput
        v-model="credentials.email"
        label="Email"
        type="email"
        required
        placeholder="Enter your email"
        :error="errors.email"
      />

      <AppInput
        v-model="credentials.password"
        label="Password"
        type="password"
        required
        placeholder="Enter your password"
        :error="errors.password"
      />

      <div class="flex items-center justify-center w-full my-4">
        <AppButton variant="primary" :loading="loading" :disabled="loading">
          Login
        </AppButton>
      </div>

      <p class="mt-4 text-center text-gray-800">
        Don't have an account?
        <router-link to="/auth/register" class="text-blue-500"
          >Sign Up</router-link
        >
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../store/auth";
import AppInput from "../../components/common/AppInput.vue";
import AppButton from "../../components/common/AppButton.vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const credentials = ref({
  email: "",
  password: "",
});

const errors = ref({
  email: "",
  password: "",
});

const loading = ref(false);

const handleSubmit = async () => {
  errors.value = {};
  if (!credentials.value.email) {
    errors.value.email = "Email is required";
  }
  if (!credentials.value.password) {
    errors.value.password = "Password is required";
  }
  if (Object.values(errors.value).some((error) => error)) return;
  loading.value = true;
  try {
    await authStore.login(credentials.value);
    router.push("/dashboard");
  } catch (error) {
    console.error("Login failed", error);
  } finally {
    loading.value = false;
  }
};
</script>
