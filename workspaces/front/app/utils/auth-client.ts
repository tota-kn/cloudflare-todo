import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
  baseURL: "http://127.0.0.1:8787",
})

export const { signIn, signOut, signUp, useSession } = authClient
