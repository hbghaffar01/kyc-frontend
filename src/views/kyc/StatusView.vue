<template>
  <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
    <div>
      <h2 class="text-2xl font-semibold">KYC Details</h2>
      <div class="space-y-2 text-gray-800">
        <p><strong>ID:</strong> {{ kyc.id }}</p>
        <p><strong>Status:</strong> {{ kyc.status }}</p>
        <p><strong>Reviewed By:</strong> {{ kyc.reviewedBy ?? "N/A" }}</p>
        <p><strong>Remarks:</strong> {{ kyc.remarks ?? "N/A" }}</p>
        <p><strong>User Email:</strong> {{ kyc.userEmail }}</p>
        <p><strong>Reviewed At:</strong> {{ kyc.reviewedAt ?? "N/A" }}</p>
        <p><strong>Created At:</strong> {{ formatDate(kyc.createdAt) }}</p>
        <p><strong>Updated At:</strong> {{ formatDate(kyc.updatedAt) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useKycStore } from "@/store/kyc";

const kycStore = useKycStore();
const kyc = reactive(kycStore.kycData);

const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString();
};
</script>
