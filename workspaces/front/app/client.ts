import { hc } from "hono/client"
import type { ClientType } from "./types/shared"
import { getApiUrl, isDev, isLocal, isPrd } from "./utils/env"

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
  if (isLocal(env)) {
    return hc<ClientType>(env.API_BASE_URL, { headers })
  } else if (isDev(env) || isPrd(env)) {
    return hc<ClientType>("http://example/", {
      fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
      headers,
    })
  } else {
    throw new Error("Unknown environment")
  }
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

  let response: Response
  if (isLocal(env)) {
    response = await fetch(`${env.API_BASE_URL}/api/auth/get-session`, {
      headers,
    })
  } else if (isDev(env) || isPrd(env)) {
    response = await env.BACKEND_API.fetch(
      new Request("http://example/api/auth/get-session", { headers })
    )
  } else {
    throw new Error("Unknown environment")
  }

  if (!response.ok) return false
  const data = await response.json()
  return data !== null
}
