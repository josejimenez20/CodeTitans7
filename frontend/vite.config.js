/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // En producción, Nginx se encarga del puerto y el SSL,
  // así que no necesitamos la configuración de 'server' aquí para el build.
})