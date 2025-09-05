<script setup>
import Card from "../components/ui/card.vue";
</script>

<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <Card
      link="/about"
      title="About Us"
      description="Learn more about our team and mission."
      className="mb-4"
    />
  </div>
</template>
