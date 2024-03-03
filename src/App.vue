<script setup>
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter();
  const route = useRoute();

  function clickhome() {
    router.push('/__mxp/home');
  };
</script>

<template>
  <router-view></router-view>
</template>
