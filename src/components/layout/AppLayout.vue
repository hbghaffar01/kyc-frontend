<template>
  <div class="min-h-screen bg-gray-50 flex flex-col md:flex-row">
    <aside class="bg-blue-600 text-white w-64 p-4">
      <h2
        class="text-xl mb-4 text-teal-300 font-bold cursor-pointer border-b border-teal-200 w-44"
        @click="navigateTo('/dashboard')"
      >
        Kyc Management
      </h2>
      <div class="flex items-start flex-col space-y-6 my-8">
        <AppButton
          variant="primary"
          size="md"
          :active="isActive('/dashboard')"
          @click="navigateTo('/dashboard')"
        >
          Dashboard
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          :active="isActive('/users')"
          @click="navigateTo('/users')"
        >
          Users
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          :active="isActive('/kyc/status')"
          @click="navigateTo('/kyc/status')"
        >
          KYC Status
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          :active="isActive('/profile')"
          @click="navigateTo('/profile')"
        >
          Profile
        </AppButton>
      </div>
    </aside>

    <div class="flex-grow flex flex-col">
      <header
        class="bg-blue-600 text-white p-4 flex justify-between items-center"
      >
        <div class="d-none"></div>
        <AppButton variant="success" size="sm" @click="handleLogout">
          Logout
        </AppButton>
      </header>

      <main class="flex-grow p-4">
        <router-view />
      </main>

      <footer class="bg-blue-600 text-white p-4 text-center">
        <p>&copy; 2025 @haseeb</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import AppButton from "@/components/common/AppButton.vue";
import { useAuthStore } from "@/store/auth";
import { useKycStore } from "@/store/kyc";
import { useAdminStore } from "../../store/admin";
import { setLoading } from "@/composables/loadingState";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const kycStore = useKycStore();
const adminStore = useAdminStore();

const isActive = (path) => {
  return route.path === path;
};

const navigateTo = (path) => {
  router.push(path);
};

const handleLogout = async () => {
  setLoading(true);
  try {
    await authStore.logout();
    router.push("/auth/login");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setLoading(false);
  }
};

onMounted(async () => {
  await authStore.getUserProfile();
  await kycStore.fetchKycStatus(authStore?.profile?.email);
  await adminStore.fetchAllUsers();
  await adminStore.fetchDashboardStats();
});
</script>
