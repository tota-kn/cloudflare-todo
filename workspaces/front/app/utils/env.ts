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

/**
 * 環境に応じたAPI URLを取得
 * @param env サーバーサイドの環境オブジェクト（オプション）
 * @returns API URL
 */
export function getApiUrl(env?: Env): string {
  const stage = getStage(env)

  switch (stage) {
    case "local":
      return "http://localhost:8787"
    case "dev":
      return "https://api.todo.dev.totakn.com"
    case "prd":
      return "https://api.todo.totakn.com"
  }
}
