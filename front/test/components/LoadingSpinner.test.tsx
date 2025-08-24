import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LoadingSpinner } from "~/components/LoadingSpinner"

/**
 * LoadingSpinnerコンポーネントのテスト
 */
describe("LoadingSpinner", () => {
  it("正常にレンダリングされること", () => {
    const { container } = render(<LoadingSpinner />)

    // コンポーネントが正常にレンダリングされることを確認
    expect(container).toBeTruthy()
  })

  it("アニメーションクラスが適用されていること", () => {
    render(<LoadingSpinner />)

    // アニメーションクラスが適用されていることを確認
    const spinnerElement = document.querySelector(".animate-spin")
    expect(spinnerElement).toBeTruthy()
  })

  it("適切なスタイリングクラスが適用されていること", () => {
    render(<LoadingSpinner />)

    // 基本的なスタイリングクラスが適用されていることを確認
    const container = document.querySelector(
      ".flex.justify-center.items-center.py-8"
    )
    expect(container).toBeTruthy()
  })
})
