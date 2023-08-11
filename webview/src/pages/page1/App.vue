<script setup lang="ts">

const value1 = ref('2222')
</script>

<template>
  <div>
    <img src="./assets/vue.svg" class="logo" alt="Vite logo" />
    <img src="./assets/img.png" class="logo" alt="Vite logo" />
    <img src="/vite.svg" class="logo" alt="Vite logo" />
  </div>
  <div>DEMO - {{ value1 }}</div>
</template>

<style scoped>
.logo {
  height: 6em;
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
