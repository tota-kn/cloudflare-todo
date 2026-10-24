import { createAuthClient } from "better-auth/react"
import { getApiUrl } from "./env"
const authClient = createAuthClient({
  baseURL: getApiUrl(),
})

export const { signIn, signOut, useSession } = authClient
