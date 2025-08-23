import { beforeEach, describe, expect, it } from "vitest"
import { ListTodosUseCase } from "../../../../src/application/usecases/ListTodosUseCase"
import { MockTodoRepository } from "../../mocks/MockTodoRepository"
import { TestFactory } from "../../mocks/TestFactory"

describe("ListTodosUseCase", () => {
  let useCase: ListTodosUseCase
  let mockRepository: MockTodoRepository

  beforeEach(() => {
    mockRepository = new MockTodoRepository()
    useCase = new ListTodosUseCase(mockRepository)
  })

  describe("execute()", () => {
    it("空のリストを正常に返す", async () => {
      const result = await useCase.execute()

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it("単一のTodoを含むリストを返す", async () => {
      const todo = TestFactory.createTodo({
        title: "単一タスク",
        description: "単一のテストタスク",
      })
      await mockRepository.save(todo)

      const result = await useCase.execute()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: todo.getId().getValue(),
        title: "単一タスク",
        description: "単一のテストタスク",
        completed: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("複数のTodoを含むリストを返す", async () => {
      const todo1 = TestFactory.createTodo({
        title: "タスク1",
        description: "説明1",
      })
      const todo2 = TestFactory.createTodo({
        title: "タスク2",
        description: "説明2",
      })
      const todo3 = TestFactory.createTodo({ title: "タスク3" }) // 説明なし

      await mockRepository.save(todo1)
      await mockRepository.save(todo2)
      await mockRepository.save(todo3)

      const result = await useCase.execute()

      expect(result).toHaveLength(3)

      const titles = result.map((todo) => todo.title)
      expect(titles).toContain("タスク1")
      expect(titles).toContain("タスク2")
      expect(titles).toContain("タスク3")
    })

    it("完了と未完了の混在したTodoリストを返す", async () => {
      const pendingTodo = TestFactory.createPendingTodo("未完了タスク")
      const completedTodo = TestFactory.createCompletedTodo("完了タスク")

      await mockRepository.save(pendingTodo)
      await mockRepository.save(completedTodo)

      const result = await useCase.execute()

      expect(result).toHaveLength(2)

      const pendingResult = result.find((todo) => todo.title === "未完了タスク")
      const completedResult = result.find((todo) => todo.title === "完了タスク")

      expect(pendingResult?.completed).toBe(false)
      expect(completedResult?.completed).toBe(true)
    })

    it("説明が空文字のTodoも正しく含まれる", async () => {
      const todoWithDescription = TestFactory.createTodo({
        title: "説明ありタスク",
        description: "テスト説明",
      })
      const todoWithoutDescription = TestFactory.createTodo({
        title: "説明なしタスク",
        description: undefined, // nullになる
      })

      await mockRepository.save(todoWithDescription)
      await mockRepository.save(todoWithoutDescription)

      const result = await useCase.execute()

      expect(result).toHaveLength(2)

      const withDesc = result.find((todo) => todo.title === "説明ありタスク")
      const withoutDesc = result.find((todo) => todo.title === "説明なしタスク")

      expect(withDesc?.description).toBe("テスト説明")
      expect(withoutDesc?.description).toBe("")
    })

    it("大量のTodoを正しく処理する", async () => {
      const todoCount = 100
      const todos = Array.from({ length: todoCount }, (_, i) =>
        TestFactory.createTodo({
          title: `タスク${i + 1}`,
          description: `説明${i + 1}`,
        })
      )

      for (const todo of todos) {
        await mockRepository.save(todo)
      }

      const result = await useCase.execute()

      expect(result).toHaveLength(todoCount)
      expect(result.every((todo) => todo.title.startsWith("タスク"))).toBe(true)
      expect(result.every((todo) => todo.description?.startsWith("説明"))).toBe(
        true
      )
    })
  })
})
