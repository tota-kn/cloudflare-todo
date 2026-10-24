import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vite-plus/test"
import { useGoogleSignIn } from "~/hooks/useGoogleSignIn"
import { signIn } from "~/utils/auth-client"
import { isLocal } from "~/utils/env"

vi.mock("~/utils/auth-client", () => ({
  signIn: { social: vi.fn(() => Promise.resolve()) },
}))

vi.mock("~/utils/env", () => ({
  getApiUrl: () => "http://api.test",
  isLocal: vi.fn(),
}))

/**
 * useGoogleSignInフックのテスト
 */
describe("useGoogleSignIn", () => {
  beforeEach(() => {
    vi.mocked(signIn.social).mockClear()
    vi.stubGlobal("location", { href: "" })
  })

  it("local 環境では Google を通さず dev-login へ移動する", async () => {
    vi.mocked(isLocal).mockReturnValue(true)
    const { result } = renderHook(() => useGoogleSignIn("http://front.test/en"))

    await act(() => result.current.signInWithGoogle())

    expect(window.location.href).toBe(
      "http://api.test/api/auth/dev-login?callbackURL=http%3A%2F%2Ffront.test%2Fen"
    )
    expect(signIn.social).not.toHaveBeenCalled()
  })

  it("local 以外では Google でサインインし、戻り先を渡す", async () => {
    vi.mocked(isLocal).mockReturnValue(false)
    const { result } = renderHook(() => useGoogleSignIn("http://front.test/en"))

    await act(() => result.current.signInWithGoogle())

    expect(signIn.social).toHaveBeenCalledWith(
      { provider: "google", callbackURL: "http://front.test/en" },
      expect.anything()
    )
  })
})
