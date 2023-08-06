<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref('home page')
</script>

<template>
  <div>
    <img src="./assets/vue.svg" class="logo" alt="Vite logo" />
    <img src="/vite.svg" class="logo" alt="Vite logo" />
  </div>
  <div>Home - {{ value1 }}</div>
  <ul>
    <li><a href="/src/pages/page1/index.html">查看 page1 /src/pages/page1/index.html</a></li>
    <li><a href="/src/pages/page2/index.html">查看 page2 /src/pages/page2/index.html</a></li>
  </ul>
</template>

<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;

  &:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  &.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
}
</style>
