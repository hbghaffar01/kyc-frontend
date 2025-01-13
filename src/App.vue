<template>
  <div class="w-full h-full overflow-x-hidden">
    <Spinner />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Spinner from "./components/common/Spinner.vue";
</script>
