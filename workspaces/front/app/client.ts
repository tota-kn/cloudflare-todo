import { hc } from "hono/client"
import type { ClientType } from "./types/shared"
import { getApiUrl, isDev, isLocal, isPrd } from "./utils/env"

/**
 * 環境に応じたバックエンドへの接続設定を解決する
 * @param env Cloudflare環境変数
 * @returns 基底URLとfetch関数
 */
const resolveBackend = (env: Env): { baseUrl: string; fetcher: typeof fetch } => {
  if (isLocal(env)) {
    return { baseUrl: env.API_BASE_URL, fetcher: fetch }
  } else if (isDev(env) || isPrd(env)) {
    return {
      baseUrl: "http://example/",
      fetcher: env.BACKEND_API.fetch.bind(env.BACKEND_API) as typeof fetch,
    }
  }
  throw new Error("Unknown environment")
}

/**
 * サーバーサイド用のAPIクライアントを作成する
 * @param env Cloudflare環境変数
 * @param headers リクエストから転送するヘッダー（Cookie等）
 * @returns 型安全なHonoクライアント
 */
export const createServerFetcher = (
  env: Env,
  headers?: Record<string, string>
) => {
  const { baseUrl, fetcher } = resolveBackend(env)
  return hc<ClientType>(baseUrl, { fetch: fetcher, headers })
}

/**
 * ブラウザサイド用のAPIクライアントを作成する
 * クロスオリジンリクエストでCookieを送信するためcredentials: 'include'を設定
 * @returns 型安全なHonoクライアント
 */
export const createBrowserClient = () =>
  hc<ClientType>(getApiUrl(), { init: { credentials: "include" } })

/**
 * BetterAuthの `/api/auth/get-session` を直接呼んでセッションの有無を確認する
 * Todo一覧APIを流用するより軽量なセッション確認に使用する
 * @param env Cloudflare環境変数
 * @param cookie リクエストから転送するCookie文字列
 * @returns セッションが有効な場合true、未認証の場合false
 */
export const checkSession = async (
  env: Env,
  cookie?: string | null
): Promise<boolean> => {
  const headers: Record<string, string> = cookie ? { Cookie: cookie } : {}
  const { baseUrl, fetcher } = resolveBackend(env)

  const response = await fetcher(
    new Request(new URL("/api/auth/get-session", baseUrl).href, { headers })
  )

  if (!response.ok) return false
  const data = await response.json()
  return data !== null
}
