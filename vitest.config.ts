import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Pure-logic tests run in Node, no DOM needed. The `@` alias matches tsconfig
// so tests import the same way the app does.
export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
