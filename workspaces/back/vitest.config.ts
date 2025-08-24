import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["test/unit/**/*.test.ts"],
    environment: "node",
    env: {
      TZ: "UTC", // テスト実行時にUTCタイムゾーンを設定
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/application/repositories/**",
        "src/infrastructure/**",
        "src/presentation/**",
        "src/types/**",
        "src/Dependencies.ts",
        "src/index.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
