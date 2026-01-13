import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
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
  test: {
    include: ['src/**/*.test.ts'],
  },
})
