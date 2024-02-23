import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'mxp'
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
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
