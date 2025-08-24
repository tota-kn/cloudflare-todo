import { describe, expect, it } from "vitest"
import { formatDateTime } from "~/utils/dateFormat"

/**
 * formatDateTime関数のテスト
 */
describe("formatDateTime", () => {
  it("ISO形式の日付文字列を日本語形式でフォーマットできること", () => {
    const isoDate = "2024-01-15T09:30:45.000Z"
    const formatted = formatDateTime(isoDate)

    // 基本的なフォーマットが正しいことを確認
    expect(formatted).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/)
  })

  it("異なる日付でも正しくフォーマットされること", () => {
    const isoDate = "2023-12-25T23:59:59.000Z"
    const formatted = formatDateTime(isoDate)

    // フォーマットが正しいことを確認
    expect(formatted).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/)
    expect(typeof formatted).toBe("string")
    expect(formatted.length).toBeGreaterThan(0)
  })

  it("現在の日付でも正しく処理されること", () => {
    const now = new Date()
    const isoDate = now.toISOString()
    const formatted = formatDateTime(isoDate)

    // フォーマットが正しいことを確認
    expect(formatted).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/)
    expect(typeof formatted).toBe("string")
  })
})
