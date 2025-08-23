import { includeIgnoreFile } from "@eslint/compat"
import eslint from "@eslint/js"
import boundariesPlugin from "eslint-plugin-boundaries"
import importPlugin from "eslint-plugin-import"
import prettierPlugin from "eslint-plugin-prettier"
import path from "node:path"
import { fileURLToPath } from "node:url"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  includeIgnoreFile(gitignorePath),

  // prettier設定
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // tsConfig設定の参照
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },

  // eslint-plugin-import
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // Domain層は他の層をimportできない
            {
              target: "./src/domain/**/*",
              from: [
                "./src/application/**/*",
                "./src/infrastructure/**/*",
                "./src/presentation/**/*",
              ],
              message: "Domain layer must not depend on any other layer",
            },
            // Application層はPresentation/Infrastructure層をimportできない
            {
              target: "./src/application/**/*",
              from: ["./src/presentation/**/*", "./src/infrastructure/**/*"],
              message: "Application layer can only depend on domain layer",
            },
            // Infrastructure層はPresentation/Application層をimportできない（type importは除く）
            {
              target: "./src/infrastructure/**/*",
              from: [
                "./src/presentation/**/!(repositories)/**/*",
                "./src/application/**/!(repositories)/**/*",
              ],
              message:
                "Infrastructure layer can only depend on domain and application layers",
            },
            // Presentation層は他の層をimportできない
            {
              target: "./src/presentation/**/*",
              from: [
                "./src/domain/**/*",
                "./src/application/**/*",
                "./src/infrastructure/**/*",
              ],
              message: "Presentation layer must not depend on any other layer",
            },
          ],
        },
      ],
    },
  },

  // eslint-plugin-boundarie
  {
    plugins: {
      boundaries: boundariesPlugin,
    },
    settings: {
      "boundaries/elements": [
        {
          type: "domain",
          pattern: "src/domain/**/*",
        },
        {
          type: "application",
          pattern: "src/application/**/*",
        },
        {
          type: "infrastructure",
          pattern: "src/infrastructure/**/*",
        },
        {
          type: "presentation",
          pattern: "src/presentation/**/*",
        },
      ],
      "boundaries/ignore": [
        "src/types/**/*",
        "src/index.ts",
        "src/Dependencies.ts",
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // Domain層: 同じドメイン層内のファイルには依存可能、他の層は不可
            {
              from: "domain",
              allow: ["domain"],
              disallow: ["application", "infrastructure", "presentation"],
              message: "Domain layer must not depend on any other layer",
            },
            // Application層: Domain層とApplication層内のファイルに依存可能
            {
              from: "application",
              allow: ["domain", "application"],
              disallow: ["infrastructure", "presentation"],
              message: "Application layer can only depend on domain layer",
            },
            // Infrastructure層: Domain層、Application層、Infrastructure層内のファイルに依存可能
            {
              from: "infrastructure",
              allow: ["domain", "application", "infrastructure"],
              disallow: ["presentation"],
              message:
                "Infrastructure layer can only depend on domain and application layers",
            },
          ],
        },
      ],
    },
  }
)
