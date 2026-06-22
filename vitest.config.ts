import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Pure-logic tests run in a Node environment (no DOM needed). The `@` alias
// mirrors tsconfig so tests can import the same way the app does.
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
