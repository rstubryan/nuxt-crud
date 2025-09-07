<script setup>
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen sm:p-6 lg:p-8 p-4 bg-gray-100 dark:bg-gray-900"
  >
    <slot />
  </div>
</template>
