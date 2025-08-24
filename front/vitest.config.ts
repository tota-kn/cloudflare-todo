import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "app/**/*.d.ts",
        "app/**/*.test.{ts,tsx}",
        "app/**/*.spec.{ts,tsx}",
      ],
    },
  },
})
