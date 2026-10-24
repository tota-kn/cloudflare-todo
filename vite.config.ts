import { defineConfig } from "vite-plus"

/**
 * オニオンアーキテクチャの層ごとに import を禁止するパターンを作る。
 * @param groups 禁止する import パスの gitignore 形式パターン
 * @param message 違反時のメッセージ
 * @returns no-restricted-imports のルール設定
 */
const restrictLayers = (
  groups: string[],
  message: string
): ["error", { patterns: { group: string[]; message: string }[] }] => [
  "error",
  { patterns: [{ group: groups, message }] },
]

export default defineConfig({
  fmt: {
    semi: false,
    singleQuote: false,
    trailingComma: "es5",
    tabWidth: 2,
    useTabs: false,
    printWidth: 80,
    ignorePatterns: [
      ".claude/**",
      ".devcontainer/**",
      ".github/**",
      ".vscode/**",
      "scripts/**",
      "**/*.md",
      "**/src/types/env.d.ts",
      "**/worker-configuration.d.ts",
      "pnpm-lock.yaml",
    ],
  },
  lint: {
    plugins: ["typescript", "react", "import", "unicorn", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      // AI が肥大化・複雑化させたコードを機械的に止めるための上限
      "max-lines": [
        "error",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
      "max-lines-per-function": [
        "error",
        { max: 50, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["error", 10],
      "max-depth": ["error", 3],
      "max-params": ["error", 3],
      "import/no-cycle": "error",
      "typescript/no-explicit-any": "error",
    },
    ignorePatterns: [
      "**/src/types/env.d.ts",
      "**/worker-configuration.d.ts",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.react-router/**",
    ],
    overrides: [
      {
        // describe / it のコールバックはケースを足すほど長くなるのが正常
        files: ["**/test/**", "**/tests/**"],
        rules: { "max-lines-per-function": "off" },
      },
      {
        // 引数は React Router が決めていて減らせない
        files: ["workspaces/front/app/entry.server.tsx"],
        rules: { "max-params": "off" },
      },
      {
        files: ["workspaces/back/src/domain/**"],
        rules: {
          "no-restricted-imports": restrictLayers(
            ["**/application/**", "**/infrastructure/**", "**/presentation/**"],
            "Domain layer must not depend on any other layer"
          ),
        },
      },
      {
        files: ["workspaces/back/src/application/**"],
        rules: {
          "no-restricted-imports": restrictLayers(
            ["**/infrastructure/**", "**/presentation/**"],
            "Application layer can only depend on domain layer"
          ),
        },
      },
      {
        files: ["workspaces/back/src/infrastructure/**"],
        rules: {
          "no-restricted-imports": restrictLayers(
            [
              "**/presentation/**",
              "**/application/**",
              "!**/application/repositories/**",
            ],
            "Infrastructure layer can only depend on domain and application/repositories"
          ),
        },
      },
      {
        files: ["workspaces/back/src/presentation/**"],
        rules: {
          "no-restricted-imports": restrictLayers(
            ["**/domain/**", "**/application/**", "**/infrastructure/**"],
            "Presentation layer can only depend on other presentation files (use Dependencies for cross-layer access)"
          ),
        },
      },
    ],
    options: { typeAware: true, typeCheck: true },
  },
})
