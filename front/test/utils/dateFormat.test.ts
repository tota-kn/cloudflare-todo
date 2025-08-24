import { describe, expect, it } from "vitest"
import { formatDateTime } from "~/utils/dateFormat"

/**
 * formatDateTime関数のテスト
 * t-wada氏のテスト設計原則に基づく包括的テスト
 */
describe("formatDateTime", () => {
  describe("正常系テスト", () => {
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

    it("特定の日時が正確にフォーマットされること", () => {
      // 2024年1月15日 9:30 UTC
      const isoDate = "2024-01-15T09:30:00.000Z"
      const formatted = formatDateTime(isoDate)

      // 日本時間（UTC+9）での表示を想定
      // 9:30 UTC = 18:30 JST
      expect(formatted).toContain("2024/01/15")
      expect(formatted).toContain("18:30")
    })
  })

  describe("境界値テスト", () => {
    it("年初の日付が正しくフォーマットされること", () => {
      const newYearDate = "2024-01-01T00:00:00.000Z"
      const formatted = formatDateTime(newYearDate)

      expect(formatted).toContain("2024/01/01")
      expect(typeof formatted).toBe("string")
    })

    it("年末の日付が正しくフォーマットされること", () => {
      const newYearEveDate = "2024-12-31T23:59:59.999Z"
      const formatted = formatDateTime(newYearEveDate)

      expect(formatted).toContain("2024/12/31")
      expect(typeof formatted).toBe("string")
    })

    it("月初の日付が正しくフォーマットされること", () => {
      const monthStartDate = "2024-06-01T00:00:00.000Z"
      const formatted = formatDateTime(monthStartDate)

      expect(formatted).toContain("2024/06/01")
      expect(typeof formatted).toBe("string")
    })

    it("月末の日付が正しくフォーマットされること", () => {
      const monthEndDate = "2024-06-30T23:59:59.999Z"
      const formatted = formatDateTime(monthEndDate)

      expect(formatted).toContain("2024/06/30")
      expect(typeof formatted).toBe("string")
    })

    it("うるう年の2月29日が正しく処理されること", () => {
      const leapYearDate = "2024-02-29T12:00:00.000Z"
      const formatted = formatDateTime(leapYearDate)

      expect(formatted).toContain("2024/02/29")
      expect(typeof formatted).toBe("string")
    })

    it("Unix epoch時刻が正しく処理されること", () => {
      const epochDate = "1970-01-01T00:00:00.000Z"
      const formatted = formatDateTime(epochDate)

      expect(formatted).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}/)
      expect(typeof formatted).toBe("string")
    })

    it("将来の日付が正しく処理されること", () => {
      const futureDate = "2030-12-31T23:59:59.999Z"
      const formatted = formatDateTime(futureDate)

      expect(formatted).toContain("2030/12/31")
      expect(typeof formatted).toBe("string")
    })
  })

  describe("異常値テスト", () => {
    it("不正な日付文字列でもエラーを投げないこと", () => {
      const invalidDate = "invalid-date-string"

      expect(() => formatDateTime(invalidDate)).not.toThrow()

      const result = formatDateTime(invalidDate)
      expect(typeof result).toBe("string")
    })

    it("空文字列でもエラーを投げないこと", () => {
      const emptyString = ""

      expect(() => formatDateTime(emptyString)).not.toThrow()

      const result = formatDateTime(emptyString)
      expect(typeof result).toBe("string")
    })

    it("部分的に不正なISO文字列でも処理されること", () => {
      const partiallyInvalid = "2024-13-45T25:70:70.000Z"

      expect(() => formatDateTime(partiallyInvalid)).not.toThrow()

      const result = formatDateTime(partiallyInvalid)
      expect(typeof result).toBe("string")
    })

    it("数値が含まれる文字列でも処理されること", () => {
      const numericString = "1640995200000"

      expect(() => formatDateTime(numericString)).not.toThrow()

      const result = formatDateTime(numericString)
      expect(typeof result).toBe("string")
    })
  })

  describe("フォーマット一貫性テスト", () => {
    it("異なる時刻の同じ日付で日付部分が一致すること", () => {
      const morning = "2024-01-15T09:00:00.000Z"
      const evening = "2024-01-15T21:00:00.000Z"

      const morningFormatted = formatDateTime(morning)
      const eveningFormatted = formatDateTime(evening)

      // 日付部分（最初の10文字）が同じ
      expect(morningFormatted.substring(0, 10)).toBe("2024/01/15")
      expect(eveningFormatted.substring(0, 10)).toBe("2024/01/15")
    })

    it("同じ時刻の異なる日付で時刻部分が一致すること", () => {
      const date1 = "2024-01-15T12:30:00.000Z"
      const date2 = "2024-02-20T12:30:00.000Z"

      const formatted1 = formatDateTime(date1)
      const formatted2 = formatDateTime(date2)

      // 時刻部分（最後の5文字）が同じ（日本時間21:30を想定）
      expect(formatted1.slice(-5)).toBe(formatted2.slice(-5))
    })

    it("フォーマット結果が常に同じ長さを持つこと", () => {
      const dates = [
        "2024-01-01T00:00:00.000Z",
        "2024-12-31T23:59:59.999Z",
        "2000-06-15T12:30:45.123Z",
      ]

      const lengths = dates.map((date) => formatDateTime(date).length)
      const uniqueLengths = new Set(lengths)

      // 全て同じ長さ
      expect(uniqueLengths.size).toBe(1)
    })
  })

  describe("タイムゾーンテスト", () => {
    it("UTC日付がローカル時間に変換されること", () => {
      const utcMidnight = "2024-01-15T00:00:00.000Z"
      const formatted = formatDateTime(utcMidnight)

      // UTC 00:00 は日本時間 09:00 になる
      expect(formatted).toContain("09:00")
    })

    it("UTC正午がローカル時間に変換されること", () => {
      const utcNoon = "2024-01-15T12:00:00.000Z"
      const formatted = formatDateTime(utcNoon)

      // UTC 12:00 は日本時間 21:00 になる
      expect(formatted).toContain("21:00")
    })

    it("日付変更線をまたぐ変換が正しく処理されること", () => {
      const utcLateEvening = "2024-01-15T23:00:00.000Z"
      const formatted = formatDateTime(utcLateEvening)

      // UTC 23:00 は日本時間の翌日 08:00 になる
      expect(formatted).toContain("2024/01/16")
      expect(formatted).toContain("08:00")
    })
  })
})
