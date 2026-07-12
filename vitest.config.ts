import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'node', globals: true },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'server-only': resolve(__dirname, 'src/lib/test/server-only-stub.ts'),
    },
  },
});
