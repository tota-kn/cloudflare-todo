import { describe, expect, it } from "vitest"
import type { TodoWithTimestamp } from "~/utils/todoSort"
import { sortTodosByUpdatedAt } from "~/utils/todoSort"

/**
 * sortTodosByUpdatedAt関数のテスト
 * t-wada氏のテスト設計原則に基づく包括的テスト
 */
describe("sortTodosByUpdatedAt", () => {
  const createMockTodo = (
    id: string,
    updated_at: string,
    overrides?: object
  ): TodoWithTimestamp & { id: string } => ({
    id,
    updated_at,
    ...overrides,
  })

  describe("正常系テスト", () => {
    it("更新日時の降順でソートされること", () => {
      const todos = [
        createMockTodo("1", "2024-01-01T00:00:00.000Z"),
        createMockTodo("2", "2024-01-03T00:00:00.000Z"),
        createMockTodo("3", "2024-01-02T00:00:00.000Z"),
      ]

      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted[0].id).toBe("2") // 2024-01-03 (最新)
      expect(sorted[1].id).toBe("3") // 2024-01-02
      expect(sorted[2].id).toBe("1") // 2024-01-01 (最古)
    })

    it("同じ更新日時の場合、元の順序が保持されること", () => {
      const sameDate = "2024-01-01T00:00:00.000Z"
      const todos = [
        createMockTodo("1", sameDate),
        createMockTodo("2", sameDate),
        createMockTodo("3", sameDate),
      ]

      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted[0].id).toBe("1")
      expect(sorted[1].id).toBe("2")
      expect(sorted[2].id).toBe("3")
    })

    it("ミリ秒単位での精密なソートができること", () => {
      const todos = [
        createMockTodo("1", "2024-01-01T00:00:00.001Z"),
        createMockTodo("2", "2024-01-01T00:00:00.003Z"),
        createMockTodo("3", "2024-01-01T00:00:00.002Z"),
      ]

      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted[0].id).toBe("2") // .003Z (最新)
      expect(sorted[1].id).toBe("3") // .002Z
      expect(sorted[2].id).toBe("1") // .001Z (最古)
    })
  })

  describe("境界値テスト", () => {
    it("空配列の場合、空配列が返されること", () => {
      const todos: TodoWithTimestamp[] = []
      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted).toEqual([])
      expect(Array.isArray(sorted)).toBe(true)
    })

    it("単一要素の場合、そのまま返されること", () => {
      const todos = [createMockTodo("1", "2024-01-01T00:00:00.000Z")]
      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted).toHaveLength(1)
      expect(sorted[0].id).toBe("1")
    })

    it("最小限の日付値でソートできること", () => {
      const todos = [
        createMockTodo("1", "1970-01-01T00:00:00.000Z"), // Unix epoch
        createMockTodo("2", "2024-01-01T00:00:00.000Z"),
      ]

      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted[0].id).toBe("2") // 2024年 (最新)
      expect(sorted[1].id).toBe("1") // 1970年 (最古)
    })

    it("将来の日付でもソートできること", () => {
      const todos = [
        createMockTodo("1", "2024-01-01T00:00:00.000Z"),
        createMockTodo("2", "2030-12-31T23:59:59.999Z"),
        createMockTodo("3", "2025-06-15T12:30:45.123Z"),
      ]

      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted[0].id).toBe("2") // 2030年 (最新)
      expect(sorted[1].id).toBe("3") // 2025年
      expect(sorted[2].id).toBe("1") // 2024年 (最古)
    })
  })

  describe("型安全性テスト", () => {
    interface ExtendedTodo extends TodoWithTimestamp {
      id: string
      title: string
      description: string
    }

    it("拡張された型でも正しく動作すること", () => {
      const todos: ExtendedTodo[] = [
        {
          id: "1",
          title: "Todo 1",
          description: "説明 1",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          title: "Todo 2",
          description: "説明 2",
          updated_at: "2024-01-02T00:00:00.000Z",
        },
      ]

      const sorted = sortTodosByUpdatedAt(todos)

      expect(sorted[0].id).toBe("2")
      expect(sorted[0].title).toBe("Todo 2")
      expect(sorted[1].id).toBe("1")
      expect(sorted[1].title).toBe("Todo 1")
    })

    it("型の制約が正しく働くこと", () => {
      // この関数は TodoWithTimestamp インターフェースを継承する型のみを受け入れる
      const validTodos = [
        {
          id: "1",
          updated_at: "2024-01-01T00:00:00.000Z",
          customField: "test",
        },
        { id: "2", updated_at: "2024-01-02T00:00:00.000Z", anotherField: 123 },
      ]

      const sorted = sortTodosByUpdatedAt(validTodos)
      expect(sorted[0].id).toBe("2")
      expect(sorted[1].id).toBe("1")
    })
  })

  describe("不変性テスト", () => {
    it("元の配列が変更されないこと", () => {
      const originalTodos = [
        createMockTodo("1", "2024-01-01T00:00:00.000Z"),
        createMockTodo("2", "2024-01-02T00:00:00.000Z"),
      ]
      const originalOrder = [...originalTodos]

      const sorted = sortTodosByUpdatedAt(originalTodos)

      // 元の配列は変更されていない
      expect(originalTodos).toEqual(originalOrder)
      // ソート結果は新しい配列
      expect(sorted).not.toBe(originalTodos)
      // ソート結果は正しい
      expect(sorted[0].id).toBe("2")
      expect(sorted[1].id).toBe("1")
    })
  })

  describe("パフォーマンステスト", () => {
    it("大量データでもエラーが発生しないこと", () => {
      // 1000件のテストデータを作成
      const todos = Array.from({ length: 1000 }, (_, i) => {
        const date = new Date(2024, 0, 1, 0, 0, 0, i)
        return createMockTodo(`id-${i}`, date.toISOString())
      })

      expect(() => sortTodosByUpdatedAt(todos)).not.toThrow()

      const sorted = sortTodosByUpdatedAt(todos)
      expect(sorted).toHaveLength(1000)

      // 最新が最初、最古が最後に来ることを確認
      expect(sorted[0].id).toBe("id-999")
      expect(sorted[999].id).toBe("id-0")
    })
  })

  describe("エラーハンドリングテスト", () => {
    it("不正な日付形式があっても処理が継続されること", () => {
      const todos = [
        createMockTodo("1", "invalid-date"),
        createMockTodo("2", "2024-01-01T00:00:00.000Z"),
        createMockTodo("3", "also-invalid"),
      ]

      // エラーをスローしない
      expect(() => sortTodosByUpdatedAt(todos)).not.toThrow()

      const sorted = sortTodosByUpdatedAt(todos)
      expect(sorted).toHaveLength(3)

      // 有効な日付が正しい位置にある
      expect(sorted.find((todo) => todo.id === "2")?.updated_at).toBe(
        "2024-01-01T00:00:00.000Z"
      )
    })
  })
})
