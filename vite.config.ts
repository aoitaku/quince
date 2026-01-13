import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'lib',
    minify: 'oxc',
    lib: {
      entry: 'src/index.ts',
      name: 'quince',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['lodash'],
      output: {
        exports: 'named',
      },
    },
  },
})
