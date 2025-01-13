<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div class="text-center space-y-6 max-w-xl">
      <h1 class="text-6xl font-bold text-gray-900">404</h1>
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p class="text-gray-600">
          Sorry, we couldn't find the page you're looking for. Please check the
          URL or return to dashboard.
        </p>
      </div>

      <div class="pt-4">
        <button
          @click="redirectToDashboard"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const redirectToDashboard = () => {
  router.push("/dashboard");
};
</script>
