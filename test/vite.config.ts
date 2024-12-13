import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@vinctus/react-maplibre': path.resolve(__dirname, '../dist'),
      '@edadma/react-tailwind': path.resolve(__dirname, 'node_modules/@edadma/react-tailwind')
    }
  }
})