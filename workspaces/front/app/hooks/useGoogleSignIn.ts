import { useState } from "react"
import { signIn } from "~/utils/auth-client"
import { getApiUrl, isLocal } from "~/utils/env"

/**
 * Google サインインを始めるフック
 * local 環境では実際の Google OAuth をスキップし、dev-login でシード済みテストユーザーとしてログインする
 * @param callbackURL サインイン後に戻るフロントの URL
 * @returns サインイン中かどうかと、サインインを始める関数
 */
export const useGoogleSignIn = (callbackURL: string) => {
  const [signingIn, setSigningIn] = useState(false)

  const signInWithGoogle = async () => {
    if (isLocal()) {
      window.location.href = `${getApiUrl()}/api/auth/dev-login?callbackURL=${encodeURIComponent(callbackURL)}`
      return
    }

    setSigningIn(true)
    await signIn.social(
      { provider: "google", callbackURL },
      { onResponse: () => setSigningIn(false) }
    )
  }

  return { signingIn, signInWithGoogle }
}
