import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // © 2024 Rafał Goławski, released under the Universal Permissive License version 1.0
  build: {
	rollupOptions: {
		output: {
			entryFileNames: "assets/[name].js"
		}
	}
  }
})
