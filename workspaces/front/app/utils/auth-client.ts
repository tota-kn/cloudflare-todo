import { createAuthClient } from "better-auth/react"
import { getApiUrl } from "./env"
export const authClient = createAuthClient({
  baseURL: getApiUrl(),
})

export const { signIn, signOut, signUp, useSession } = authClient
