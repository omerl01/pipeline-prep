import { defineConfig } from 'vite'
import { default as react } from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Tells Vite to step out of the frontend folder and look at the project root for the .env file
  envDir: '../', 
  server: {
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  }
})