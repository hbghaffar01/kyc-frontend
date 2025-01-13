<template>
  <div class="min-h-screen flex flex-col justify-center bg-gray-100">
    <div class="container mx-auto p-4">
      <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthLayout",
};
</script>
