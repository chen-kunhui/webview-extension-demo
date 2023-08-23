<script setup lang="ts">
import { Socket } from 'simple-webview';
import SendIcon from './components/SendIcon.vue'
const socket: Socket = inject('$socket')!

socket.send('/ping', { message: 'test' }).then((data: any) => {
  console.log("==========success", data)
}).catch((error) => {
  console.log("============error", error)
})
</script>

<template>
  <div class="bg"></div>
  <div class="sidebar-wrap">
    <div class="content">

    </div>
    <div class="footer">
      <textarea class="prompt-input-box"></textarea>
      <SendIcon class="send-icon"></SendIcon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-image: url(./assets/h1.jpg);
  background-size: cover;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  z-index: -10;
}
.sidebar-wrap {
  height: calc(100vh - 10px);
  .content {
    height: calc(100% - 60px);
  }
  .footer {
    display: flex;
    justify-content: center;
    position: relative;
    .prompt-input-box {
      padding: 5px;
      height: 40px;
      resize: none;
      width: calc(100% - 20px);
      border: none;
      outline: none;
      font-size: 12px;
      border-radius: 5px;
      opacity: 0.5;
      color: #141414;
      font-weight: bold;
      &:focus {
        opacity: 0.8;
      }
    }
    .send-icon {
      width: 24px;
      vertical-align: middle;
      fill: currentcolor;
      overflow: hidden;
      position: absolute;
      right: 15px;
      top: 5px;
      cursor: pointer;
      &:hover {
        filter: drop-shadow(-1px 4px 3px #0050b3);;
      }
    }
  }
  
}

</style>
