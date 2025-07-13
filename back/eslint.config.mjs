import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  includeIgnoreFile(gitignorePath),
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Domain層は他の層をimportできない
            {
              target: './src/domain/**/*',
              from: ['./src/usecases/**/*', './src/infrastructure/**/*', './src/presentation/**/*'],
            },
            // UseCase層はpresentation/infrastructureをimportできない
            {
              target: './src/usecases/**/*',
              from: ['./src/presentation/**/*', './src/infrastructure/**/*'],
              except: ['./src/usecases/repositories/**/*'],
            },
            // Infrastructure層はpresentation/usecaseをimportできない（type importは除く）
            {
              target: './src/infrastructure/**/*',
              from: ['./src/presentation/**/!(repositories)/**/*', './src/usecases/**/!(repositories)/**/*'],
            },
          ],
        },
      ],
    },
  },
)
