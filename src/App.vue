<script setup>
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter();
  const route = useRoute();

  function clickme() {
    router.push('/conf');
  };
</script>

<template>
  <router-view></router-view>
</template>
