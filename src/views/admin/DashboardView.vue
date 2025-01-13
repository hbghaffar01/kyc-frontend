<template>
  <div class="flex items-center justify-between">
    <Card heading="Total Users" :value="dashboardStats?.totalUsers" />
    <Card heading="Approved Kyc" :value="dashboardStats?.approvedKyc" />
    <Card heading="Pending Kyc" :value="dashboardStats?.pendingKyc" />
    <Card heading="Rejected Kyc" :value="dashboardStats?.rejectedKyc" />
  </div>

  <div class="flex items-center justify-between">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Customer List</h2>
    <AppButton
      :loading="isSubmitting"
      class="mt-4"
      variant="primary"
      @click="openDialog"
    >
      Submit KYC
    </AppButton>
  </div>

  <AppTable
    :columns="columns"
    :data="kycStore.kycs"
    :loading="kycStore.loading"
    :emptyMessage="'No KYC data available'"
    :hasActions="true"
    :showPagination="true"
    :currentPage="currentPage"
    :totalItems="totalItems"
    :itemsPerPage="itemsPerPage"
    @page-change="handlePageChange"
    @edit-item="openUpdateDialog"
  />

  <KycFormDialog
    v-model="showModal"
    :isSubmitting="isSubmitting"
    :formData="selectedKyc"
    :isUpdating="isUpdating"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { useAdminStore } from "../../store/admin";
import Card from "../../components/common/Card.vue";
import { onMounted, ref, computed } from "vue";
import { useKycStore } from "@/store/kyc";
import KycFormDialog from "@/components/KycFormDialog.vue";
import AppButton from "@/components/common/AppButton.vue";
import AppTable from "@/components/common/AppTable.vue";

const adminStore = useAdminStore();

const dashboardStats = ref(adminStore.dashboardStats);
const showModal = ref(false);
const kycStore = useKycStore();
const isSubmitting = ref(false);
const isUpdating = ref(false);
const selectedKyc = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(5);

const totalItems = computed(() => (kycStore.kycs ? kycStore.kycs.length : 0));

const columns = [
  { key: "id", label: "ID" },
  { key: "fullName", label: "Full Name" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "userEmail", label: "User Email" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

const openDialog = () => {
  isUpdating.value = false;
  selectedKyc.value = null;
  showModal.value = true;
};

const openUpdateDialog = (kycData) => {
  isUpdating.value = true;
  selectedKyc.value = kycData;
  showModal.value = true;
};

onMounted(async () => {
  await kycStore.getKycsList();
});

const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  try {
    if (isUpdating.value) {
      await kycStore.updateKyc(formData.id, formData);
    } else {
      await kycStore.submitKyc(formData);
    }
    await kycStore.getKycsList();
  } catch (error) {
    console.error(
      isUpdating.value ? "KYC update failed" : "KYC submission failed",
      error
    );
  } finally {
    isSubmitting.value = false;
    showModal.value = false;
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};
</script>

<style></style>
