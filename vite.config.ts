import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { version } from './package.json'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
})
