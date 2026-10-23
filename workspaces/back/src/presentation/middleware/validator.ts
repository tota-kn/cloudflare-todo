import { zValidator } from "@hono/zod-validator"
import type { ValidationTargets } from "hono"
import { z } from "zod"

/**
 * 検証失敗時のレスポンスを `{ error: string }` に揃えた zValidator。
 * 既定の 400 は ZodError をそのまま返し、RPC 型の `error` が文字列でなくなるため包む。
 * @param target 検証対象（json / param など）
 * @param schema Zod スキーマ
 * @returns Hono のバリデーションミドルウェア
 */
export const validator = <
  Target extends keyof ValidationTargets,
  Schema extends z.ZodType,
>(
  target: Target,
  schema: Schema
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json({ error: z.prettifyError(result.error) }, 400)
    }
  })
