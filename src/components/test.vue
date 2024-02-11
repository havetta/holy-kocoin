<script setup>
  import { onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter();
  const route = useRoute();

  function clickme() {
    router.push('/conf');
  };

  onMounted(() => {
    console.log(`test.vue mounted`);
  });
</script>

<template>
  <div class="logo" @click="clickme">
    <img src="/vite.svg" class="logo" alt="logo" />
  </div>
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
