import { drizzle } from "drizzle-orm/d1"
import * as authSchema from "./authSchema"

/**
 * 認証用のDrizzleデータベースインスタンスを作成する
 * better-authのdrizzleAdapterで使用される
 * 
 * @param db - Cloudflare D1データベースインスタンス
 * @returns 認証テーブルスキーマを含むDrizzleインスタンス
 */
export const createAuthDatabase = (db: D1Database) => {
  return drizzle(db, { schema: authSchema })
}