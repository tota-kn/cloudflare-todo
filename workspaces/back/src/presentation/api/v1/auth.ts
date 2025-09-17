import { Hono } from "hono"
import { auth } from "../../../utils/auth"

/**
 * 認証関連のルートを処理するHonoアプリケーション
 * @param env Cloudflare環境変数
 * @returns 認証ルートを含むHonoアプリケーション
 */
export function v1Auth() {
  return new Hono<{ Bindings: CloudflareEnv }>().on(
    ["POST", "GET"],
    "/api/auth/*",
    (c) => auth(c.env).handler(c.req.raw)
  )
}
