import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
    'process.env.VITE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_AUTH_DOMAIN),
    'process.env.VITE_PROJECT_ID': JSON.stringify(process.env.VITE_PROJECT_ID),
    'process.env.VITE_STORAGE_BUCKET': JSON.stringify(process.env.VITE_STORAGE_BUCKET),
    'process.env.VITE_MESSAGING_SENDER_ID': JSON.stringify(process.env.VITE_MESSAGING_SENDER_ID),
    'process.env.VITE_APP_ID': JSON.stringify(process.env.VITE_APP_ID)
  }
});
