import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        pageHome: resolve(__dirname, 'index.html'),
        page1: resolve(__dirname, 'src/pages/page1/index.html'),
        page2: resolve(__dirname, 'src/pages/page2/index.html'),
      },
    },
  },
})
