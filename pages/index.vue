<script setup>
import Card from "../components/ui/card.vue";

useHead({
  title: "My App",
});
</script>

<template>
  <NuxtLayout name="main">
    <template #header>
      <!--      <h1 class="text-3xl font-bold underline">Welcome to My App</h1>-->
    </template>

    <Card class="mt-6 p-4" description="Hello" title="World">
      <p>This is a card component inside the main layout.</p>
    </Card>

    <template #footer>
      <!--      <p class="text-center text-sm text-gray-500">-->
      <!--        &copy; 2024 My App. All rights reserved.-->
      <!--      </p>-->
    </template>
  </NuxtLayout>
</template>
