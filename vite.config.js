import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// https://github.com/vitejs/vite/issues/378#issuecomment-768816653
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
	rollupOptions: {
		output: {
			entryFileNames: "assets/[name].js"
		}
	}
  }
})
