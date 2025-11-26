import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ReactCompilerConfig = {
  target: '19',
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig]
        ]
      }
    }),
    tailwindcss(),
  ],
  base: '/marvelcdb-filtering',
  build: {
    outDir: 'marvelcdb-filtering'
  }
})
