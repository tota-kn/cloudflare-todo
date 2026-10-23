import { render } from "@testing-library/react"
import { describe, expect, it } from "vite-plus/test"
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
})
