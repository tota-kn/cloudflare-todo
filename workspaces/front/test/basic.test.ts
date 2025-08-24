import { describe, expect, it } from "vitest"

/**
 * 基本的な算術演算関数
 */
function add(a: number, b: number): number {
  return a + b
}

describe("基本テスト", () => {
  it("1 + 1 = 2", () => {
    expect(add(1, 1)).toBe(2)
  })

  it("2 + 3 = 5", () => {
    expect(add(2, 3)).toBe(5)
  })
})
