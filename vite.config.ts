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
    outDir: 'marvelcdb-filtering',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'astryx', test: /node_modules[\\/]@astryxdesign[\\/]/, tags: ['$initial'], maxSize: 480 * 1024 },
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler|react-redux|redux|@reduxjs|react-i18next|i18next)[\\/]/, tags: ['$initial'] },
            { name: 'vendor', test: /node_modules[\\/]/, tags: ['$initial'] },
          ],
        },
      },
    },
  }
})
