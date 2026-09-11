import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.js
//import { defineConfig } from 'vite';
//import react from '@vitejs.plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:3000', // Wpisz tu port swojego backendu
        changeOrigin: true,
        secure: false,
      },
    },
  },
});