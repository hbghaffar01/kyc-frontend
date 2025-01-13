<template>
  <div class="w-full overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              column.class
            ]"
          >
            {{ column.label }}
          </th>
          <th
            v-if="hasActions"
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading" class="animate-pulse">
          <td
            :colspan="hasActions ? columns.length + 1 : columns.length"
            class="px-6 py-4"
          >
            <div class="flex items-center justify-center">
              <div
                class="w-6 h-6 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"
              ></div>
              <span class="ml-2">Loading...</span>
            </div>
          </td>
        </tr>

        <template v-else-if="paginatedData.length">
          <tr v-for="(item, index) in paginatedData" :key="index">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 whitespace-nowrap',
                column.class,
                { 'text-sm text-gray-900': !column.class }
              ]"
            >
              <slot :name="column.key" :item="item">
                {{ formatField(column.key, item[column.key]) }}
              </slot>
            </td>
            <td
              v-if="hasActions"
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                @click.prevent="$emit('edit-item', item)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
            </td>
          </tr>
        </template>

        <tr v-else>
          <td
            :colspan="hasActions ? columns.length + 1 : columns.length"
            class="px-6 py-4 text-center text-gray-500"
          >
            {{ emptyMessage }}
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="showPagination"
      class="px-6 py-3 flex items-center justify-between border-t border-gray-200"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click.prevent="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          @click.prevent="$emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startIndex + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(endIndex, totalItems) }}</span>
            of
            <span class="font-medium">{{ totalItems }}</span>
            results
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          >
            <button
              v-for="page in visiblePages"
              :key="page"
              @click.prevent="$emit('page-change', page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: "No data available",
  },
  hasActions: {
    type: Boolean,
    default: false,
  },
  showPagination: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
});

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);
const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage);
const endIndex = computed(() => startIndex.value + props.itemsPerPage);

const visiblePages = computed(() => {
  const range = [];
  const pages = Math.min(5, totalPages.value);
  for (let i = 1; i <= pages; i++) {
    range.push(i);
  }
  return range;
});

const paginatedData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value);
});

const formatField = (key, value) => {
  if (key === 'status') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  if (key === 'createdAt' || key === 'updatedAt') {
    return new Date(value).toLocaleString();
  }
  return value;
};
</script>
