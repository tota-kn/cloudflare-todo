import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { bearer } from "better-auth/plugins"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "../infrastructure/database/auth-schema"

/** Better Auth インスタンスを生成する */
export const auth = (env: CloudflareEnv) => {
  const db = drizzle(env.DB, { schema })
  return betterAuth({
    // Workersではprocess.envから自動取得されないため明示的に渡す
    // （未指定だと既知のデフォルトシークレットで署名される）
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    plugins: [bearer()],
    // 環境ごとに自オリジン(フロントエンドのURL)のみ信頼する。
    // ドメインをハードコードしないことでテンプレートからのプロジェクト生成時の置換対象を減らす
    trustedOrigins: [env.CORS_ORIGIN],
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7日間
      updateAge: 60 * 60 * 24, // 24時間後に更新
      cookieCache: {
        expiresIn: 60 * 60 * 24 * 7, // 7日間
        updateAge: 60 * 60 * 24, // 24時間後に更新
        maxAge: 60 * 60 * 24, // 24時間
      },
    },
    advanced: {
      cookiePrefix: "cloudflare-todo",
      defaultCookieAttributes: {
        domain: env.DOMAIN,
        sameSite: "lax",
        secure: env.STAGE !== "local",
      },
    },
  })
}
