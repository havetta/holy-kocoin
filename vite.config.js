import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
  esbuild: {
    supported: {
      'top-level-await': true // browsers can handle top-level-await features
    },
  },
  server: {
    port: 5555,
    hmr: { overlay: false },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
