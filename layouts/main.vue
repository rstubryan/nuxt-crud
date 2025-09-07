<script setup>
definePageMeta({
  layout: "main",
});
</script>

<template>
  <div>
    <header>
      <slot name="header"> Default header content </slot>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <slot name="footer"> Default footer content </slot>
    </footer>
  </div>
</template>
