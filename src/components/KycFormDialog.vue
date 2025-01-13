<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    v-if="isDialogOpen"
  >
    <div class="p-6 w-[450px] mx-auto bg-white rounded-lg shadow-md">
      <div class="text-center w-full">
        <h2 class="text-xl font-bold mb-4 text-gray-800">
          {{ isUpdating ? "Update KYC Form" : "KYC Form Submission" }}
        </h2>
      </div>
      <form @submit.prevent="onFormSubmit">
        <AppInput
          v-model="form.fullName"
          label="Full Name"
          placeholder="Enter your full name"
          :error="errors.fullName"
          required
        />

        <AppInput
          v-model="form.documentType"
          label="Document Type"
          placeholder="Enter document type"
          :error="errors.documentType"
          required
        />

        <div class="mb-4">
          <label for="role" class="block text-sm font-medium text-gray-700">
            Role
            <span class="text-red-500">*</span>
          </label>
          <select
            id="role"
            v-model="form.role"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
          <p v-if="errors.role" class="text-red-500 text-sm mt-1">
            {{ errors.role }}
          </p>
        </div>

        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-gray-700">
            Status
            <span class="text-red-500">*</span>
          </label>
          <select
            id="status"
            v-model="form.status"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="" disabled>Select status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
          <p v-if="errors.status" class="text-red-500 text-sm mt-1">
            {{ errors?.status }}
          </p>
        </div>

        <UploadImage
          v-model:imageUrl="form.documentUrl"
          :error="errors.documentUrl"
        />

        <div class="flex items-center justify-end gap-6">
          <AppButton :loading="isSubmitting" class="mt-4" variant="primary">
            {{ isUpdating ? "Update" : "Submit" }}
          </AppButton>
          <AppButton class="mt-4" variant="danger" @click="closeDialog">
            Close
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { validateName, validateKycDocument } from "@/utils/validation.js";
import AppButton from "@/components/common/AppButton.vue";
import AppInput from "@/components/common/AppInput.vue";
import UploadImage from "@/components/common/UploadImage.vue";

const isDialogOpen = defineModel(false);
const emit = defineEmits(["submit", "close"]);

const props = defineProps({
  isSubmitting: Boolean,
  formData: {
    type: Object,
    required: false,
  },
  isUpdating: Boolean,
});

const form = ref({
  fullName: "",
  documentType: "",
  documentUrl: "",
  role: "",
  status: "",
});

const errors = ref({});

watch(
  () => props.formData,
  (newVal) => {
    form.value = { ...newVal };
  },
  { immediate: true }
);

const validateForm = () => {
  errors.value = {};
  if (!validateName(form.value.fullName)) {
    errors.value.fullName = "Full name must be between 2 and 50 characters.";
  }
  if (!form.value.documentType) {
    errors.value.documentType = "Document type is required.";
  }
  if (!form.value.role) {
    errors.value.role = "Role is required.";
  }
  if (!form.value?.status) {
    errors.value.status = "Status is required.";
  }
  if (!validateKycDocument({ type: "image/jpeg", size: 1024 })) {
    errors.value.documentUrl =
      "Invalid document. Allowed types: JPEG, PNG, PDF. Max size: 5MB.";
  }
  return Object.keys(errors.value).length === 0;
};

const onFormSubmit = () => {
  if (validateForm()) {
    emit("submit", { ...form.value });
  }
};

const closeDialog = () => {
  isDialogOpen.value = false;
};
</script>
