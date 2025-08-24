import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  includeIgnoreFile(gitignorePath),
  prettierConfig,

  // tsConfig設定の参照
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },
);
