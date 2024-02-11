<script setup>
// import test from './components/test.vue'
</script>

<template>
  <div class="logo">
    <img src="/vite.svg" class="logo" alt="logo" />
  </div>
  <test1 />
  <root />
</template>

<style scoped>
.logo {
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
