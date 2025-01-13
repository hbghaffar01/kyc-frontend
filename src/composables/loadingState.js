import { ref } from "vue";

const isLoading = ref(false);

export const setLoading = (state) => {
  isLoading.value = state;
};

export default isLoading;
