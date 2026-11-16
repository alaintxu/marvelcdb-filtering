import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import stylex from '@stylexjs/unplugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    stylex.vite({
      unstable_moduleResolution: { type: 'commonJS', rootDir: process.cwd() },
    }),
    react({ compiler: true }),
  ],
  base: '/marvelcdb-filtering',
  build: {
    outDir: 'marvelcdb-filtering'
  }
})
