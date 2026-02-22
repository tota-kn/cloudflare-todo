import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { bearer } from "better-auth/plugins"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "../infrastructure/database/auth-schema"

/**
 * STAGEに応じたクッキードメインを返す
 * - local: localhost
 * - dev: todo.dev.totakn.com
 * - prd: todo.totakn.com
 */
const getCookieDomain = (stage: CloudflareEnv["STAGE"]): string => {
  switch (stage) {
    case "local":
      return "localhost"
    case "dev":
      return "todo.dev.totakn.com"
    case "prd":
      return "todo.totakn.com"
  }
}

/** Better Auth インスタンスを生成する */
export const auth = (env: CloudflareEnv) => {
  const db = drizzle(env.DB, { schema })
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    plugins: [bearer()],
    trustedOrigins: [
      "http://localhost:5173",
      "https://todo.dev.totakn.com",
      "https://todo.totakn.com",
    ],
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
        domain: getCookieDomain(env.STAGE),
        sameSite: "lax",
        secure: env.STAGE !== "local",
      },
    },
  })
}
