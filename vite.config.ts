import { defineConfig } from "vitest/config";
import "vitest/config";
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/client"),
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vite.setup.ts",
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      include: ['src/client/**/*.{ts,tsx}'],
      exclude: ['src/client/components/ui/**', 'src/client/main.tsx'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    }
  },
});
