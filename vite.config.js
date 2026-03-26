import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  server: {
    host: true,
    port: 5173, // hoặc cổng bạn đã mở
    watch: {
      usePolling: true, // BẮT BUỘC trong môi trường Docker
    },
  },
  plugins: [
    tailwindcss(),
    react()],
  resolve: {
    alias: {
      '@imgs': path.resolve(__dirname, './src/assets/imgs'),
    },
  },
})
