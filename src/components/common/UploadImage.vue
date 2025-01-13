<template>
  <div class="flex flex-col items-center my-4">
    <label
      for="upload"
      class="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
    >
      <p v-if="!imagePreview" class="text-gray-500">Click to upload an image</p>
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="Uploaded"
        class="h-20 w-auto"
      />
    </label>
    <input
      id="upload"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onImageUpload"
    />
    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:imageUrl"]);

const imagePreview = ref(null);

const onImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
      emit("update:imageUrl", reader.result);
    };
    reader.readAsDataURL(file);
  }
};
</script>
