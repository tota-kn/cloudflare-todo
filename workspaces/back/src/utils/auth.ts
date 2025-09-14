import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export const auth = (db: D1Database) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite" as const,
    }),
    emailAndPassword: {
      enabled: true,
      // async sendResetPassword(data, request) {
      //   // Send an email to the user with a link to reset their password
      // },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
  })
