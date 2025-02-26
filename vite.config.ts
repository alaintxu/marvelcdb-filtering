import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = {
  target: '19',
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      /*presets: ["@babel/preset-env"],*/
      plugins: [
        ["babel-plugin-react-compiler", ReactCompilerConfig]
      ]
    }
  })],
  base: '/marvelcdb-filtering'
})
