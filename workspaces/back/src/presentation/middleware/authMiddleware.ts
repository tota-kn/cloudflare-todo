import { createMiddleware } from "hono/factory"
import { auth } from "../../utils/auth"

/**
 * 認証済みユーザーのセッション情報を含むHonoの変数型定義
 */
export type AuthVariables = {
  userId: string
}

/**
 * BetterAuthセッション検証ミドルウェア
 * リクエストヘッダーからセッションを検証し、
 * 認証済みの場合はuserIdをコンテキストに設定する。
 * 未認証の場合は401を返す。
 */
export const authMiddleware = createMiddleware<{
  Bindings: CloudflareEnv
  Variables: AuthVariables
}>(async (c, next) => {
  const session = await auth(c.env).api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  c.set("userId", session.user.id)
  await next()
})
