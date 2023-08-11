<script setup lang="ts">
import { AjaxSender } from './adapter/interface';
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue';

const ajax: AjaxSender = inject('$ajax')!

ajax.send({
  method: 'get',
  url: '/ping',
  data: { message: 'test' }
}).then((data: any) => {
  console.log("==========success", data)
}).catch((error) => {
  console.log("============error", error)
})

const value1 = ref('home page')
</script>

<template>
  <div>
    <img src="./assets/vue.svg" class="logo" alt="Vite logo" />
    <img src="/vite.svg" class="logo" alt="Vite logo" />
  </div>
  <div>Home - {{ value1 }} <el-icon>
      <Edit />
    </el-icon></div>
  <ul>
    <li><a href="/src/pages/page1/index.html">查看 page1 /src/pages/page1/index.html</a></li>
    <li><a href="/src/pages/page2/index.html">查看 page2 /src/pages/page2/index.html</a></li>
  </ul>
  <div :style="{ background: 'rgb(190, 200, 200)', padding: '16px 16px' }">
    <a-space>
      <a-button type="primary" ghost>Primary</a-button>
      <a-button ghost>Default</a-button>
      <a-button type="dashed" ghost>Dashed</a-button>
      <a-button type="primary" danger ghost>Danger</a-button>
    </a-space>
  </div>
  <a-space>
    <home-outlined />
    <setting-filled />
    <smile-outlined />
    <sync-outlined spin />
    <smile-outlined :rotate="180" />
    <loading-outlined />
  </a-space>
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
