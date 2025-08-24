import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    env: {
      TZ: "UTC", // テスト実行時にUTCタイムゾーンを設定
    },
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
  resolve: {
    alias: {
      "~": "/app",
    },
  },
})
