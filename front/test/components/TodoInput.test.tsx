import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TodoInput } from "~/components/TodoInput"

/**
 * TodoInputコンポーネントのテスト
 */
describe("TodoInput", () => {
  it("正常にレンダリングされること", () => {
    const { container } = render(
      <TodoInput
        title=""
        description=""
        onTitleChange={() => {}}
        onDescriptionChange={() => {}}
      />
    )

    // コンポーネントが正常にレンダリングされることを確認
    expect(container).toBeTruthy()
  })
})
