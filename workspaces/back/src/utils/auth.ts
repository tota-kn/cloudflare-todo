import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createAuthDatabase } from "../infrastructure/database/createAuthDatabase"

/**
 * better-authの認証設定を作成する
 * 
 * @param db - Cloudflare D1データベースインスタンス
 * @returns 設定済みのbetter-authインスタンス
 */
export const createAuth = (db: D1Database) => {
  const authDb = createAuthDatabase(db)
  
  return betterAuth({
    database: drizzleAdapter(authDb, {
      provider: "sqlite"
    }),
  })
}
