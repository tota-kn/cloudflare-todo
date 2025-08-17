import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/unit/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/application/repositories/**',
        'src/infrastructure/**',
        'src/presentation/**',
        'src/types/**',
        'src/Dependencies.ts',
        'src/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
