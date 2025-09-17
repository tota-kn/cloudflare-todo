import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "../infrastructure/database/auth-schema"

export const auth = (env: CloudflareEnv) => {
  const db = drizzle(env.DB, { schema })
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
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
  })
}
