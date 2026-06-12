import { Hono } from "hono"
import { setCookie } from "hono/cookie"
import { auth } from "../../utils/auth"

/**
 * シードデータ（migrations/0002_seed_test_data.sql）の test-user-001 に紐づく固定セッショントークン。
 * workspaces/e2e/setup/global-setup.ts の TEST_SESSION_TOKEN と同じ値。
 */
const DEV_LOGIN_SESSION_TOKEN = "test-session-token-001"

/**
 * BetterAuthのセッションCookie名（utils/auth.ts の cookiePrefix "cloudflare-todo" に対応）。
 * workspaces/e2e/setup/global-setup.ts の SESSION_COOKIE_NAME と同じ値。
 */
const SESSION_COOKIE_NAME = "cloudflare-todo.session_token"

/**
 * セッショントークンからBetterAuthが検証可能な署名付きCookie値を生成する
 *
 * better-call の signCookieValue と同じ形式 `${token}.${base64(HMAC-SHA256(token, secret))}`。
 * URIエンコードは Hono の setCookie が行うため、ここでは行わない。
 *
 * @param token DBにシード済みのセッショントークン
 * @param secret BETTER_AUTH_SECRET
 * @returns 署名付きCookie値（URIエンコード前）
 */
async function signSessionToken(
  token: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(token))
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
  return `${token}.${base64}`
}

/**
 * dev-login用のテストユーザーとセッションをDBにupsertする
 *
 * シード（migrations/0002_seed_test_data.sql）と同じ test-user-001 / test-session-001 を投入する。
 * BetterAuthはサインアウト時にセッション行をDBから削除するため、シードに依存せず
 * 毎回upsertすることでdev-loginを冪等にする。
 *
 * @param db ローカルD1データベース
 */
async function upsertDevSession(db: D1Database): Promise<void> {
  await db.batch([
    db.prepare(
      `INSERT OR IGNORE INTO user (id, name, email, email_verified, created_at, updated_at)
       VALUES ('test-user-001', 'Test User 1', 'testuser1@example.com', 1, unixepoch(), unixepoch())`
    ),
    db
      .prepare(
        `INSERT OR REPLACE INTO session (id, expires_at, token, created_at, updated_at, user_id)
       VALUES ('test-session-001', strftime('%s', '2099-12-31'), ?, unixepoch(), unixepoch(), 'test-user-001')`
      )
      .bind(DEV_LOGIN_SESSION_TOKEN),
  ])
}

/**
 * 認証関連のルートを処理するHonoアプリケーション
 *
 * `/api/auth/dev-login` はlocal環境限定の開発用ログイン。実際のGoogle OAuthを経由せず、
 * テストユーザー（test-user-001）のセッションをupsertし、その署名付きCookieを設定して
 * callbackURL へリダイレクトする。
 * BetterAuthのキャッチオールより先に登録することで優先的にマッチさせる。
 *
 * @returns 認証ルートを含むHonoアプリケーション
 */
export function v1Auth() {
  return new Hono<{ Bindings: CloudflareEnv }>()
    .get("/api/auth/dev-login", async (c) => {
      // local環境以外では存在しないエンドポイントとして振る舞う
      if (c.env.STAGE !== "local") {
        return c.notFound()
      }

      // オープンリダイレクト防止: 自フロントエンドのオリジンのみ許可
      const callbackURL = c.req.query("callbackURL") ?? c.env.CORS_ORIGIN
      if (!callbackURL.startsWith(c.env.CORS_ORIGIN)) {
        return c.text("invalid callbackURL", 400)
      }

      // サインアウトでセッション行が削除されていても再ログインできるようにする
      await upsertDevSession(c.env.DB)

      const signedValue = await signSessionToken(
        DEV_LOGIN_SESSION_TOKEN,
        c.env.BETTER_AUTH_SECRET
      )
      // 属性は utils/auth.ts の defaultCookieAttributes（local: Secureなし）に合わせる
      setCookie(c, SESSION_COOKIE_NAME, signedValue, {
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
        domain: c.env.DOMAIN,
        maxAge: 60 * 60 * 24 * 7, // session.expiresIn と同じ7日間
      })
      return c.redirect(callbackURL)
    })
    .on(["POST", "GET"], "/api/auth/*", (c) => auth(c.env).handler(c.req.raw))
}
