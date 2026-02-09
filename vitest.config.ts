import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    restoreMocks: true,
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    }
  }
});
