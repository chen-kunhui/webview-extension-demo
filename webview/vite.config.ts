import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
