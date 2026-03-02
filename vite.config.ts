import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Proxy /Apipj to avoid CORS preflight on JSON+custom-header requests
      '/Apipj': {
        target: 'https://api-staging.jagota.com',
        changeOrigin: true,
        secure: true,
      },
      // Proxy /Apip for form+custom-header requests (REVISE_JOB, REVISE_LIST, REVISE_CANCEL, etc.)
      '/Apip': {
        target: 'https://api-staging.jagota.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
