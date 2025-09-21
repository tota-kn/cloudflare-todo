/**
 * 環境判別用のユーティリティ関数
 */

// ホスト名定数
const HOSTS = {
  local: "localhost",
  dev: "todo.dev.totakn.com",
  prd: "todo.totakn.com",
} as const

/**
 * ローカル環境かどうかを判定
 */
export function isLocal(env?: Env): boolean {
  if (env) {
    // サーバーサイド: env.STAGE を使用
    return env.STAGE === "local"
  }

  // ブラウザサイド: URLのホストを確認
  return (
    typeof window === "undefined" || window.location.host.includes("localhost")
  )
}

/**
 * 開発環境かどうかを判定
 */
export function isDev(env?: Env): boolean {
  if (env) {
    // サーバーサイド: API_BASE_URLで判定
    return env.STAGE === "dev"
  }

  // ブラウザサイド: URLのホスト名を確認
  return window?.location.hostname === HOSTS.dev
}

/**
 * 本番環境かどうかを判定
 */
export function isPrd(env?: Env): boolean {
  if (env) {
    // サーバーサイド: API_BASE_URLで判定
    return env.STAGE === "prd"
  }

  // ブラウザサイド: URLのホスト名を確認
  return window?.location.hostname === HOSTS.prd
}

/**
 * 現在のステージを取得
 */
export function getStage(env?: Env) {
  if (isLocal(env)) {
    return "local"
  }
  if (isDev(env)) {
    return "dev"
  }
  if (isPrd(env)) {
    return "prd"
  }

  throw new Error("Unknown stage")
}
