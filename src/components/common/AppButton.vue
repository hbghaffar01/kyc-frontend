<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses,
      sizeClasses,
      {
        'opacity-50 cursor-not-allowed': disabled,
        'bg-transparent text-current': active,
      },
    ]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-center gap-2">
      <svg
        v-if="loading"
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <slot></slot>
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "danger", "success", "warning"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const variantClasses = computed(() => {
  const classes = {
    primary:
      "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
    secondary:
      "bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
    success:
      "bg-green-600 hover:bg-green-700 focus:ring-green-500 active:bg-green-800",
    warning:
      "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 active:bg-yellow-700",
  };
  return (
    classes[props.variant] +
    (props.active ? " ring-2 ring-offset-2 ring-white" : "")
  );
});

const sizeClasses = computed(() => {
  const classes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  return classes[props.size];
});

defineEmits(["click"]);
</script>
