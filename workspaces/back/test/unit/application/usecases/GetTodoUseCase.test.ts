import { beforeEach, describe, expect, it } from "vitest"
import { GetTodoUseCase } from "../../../../src/application/usecases/GetTodoUseCase"
import { MockTodoRepository } from "../../mocks/MockTodoRepository"
import { TestFactory } from "../../mocks/TestFactory"

const TEST_USER_ID = TestFactory.DEFAULT_USER_ID
const OTHER_USER_ID = "other-user-002"

describe("GetTodoUseCase", () => {
  let useCase: GetTodoUseCase
  let mockRepository: MockTodoRepository

  beforeEach(() => {
    mockRepository = new MockTodoRepository()
    useCase = new GetTodoUseCase(mockRepository)
  })

  describe("execute()", () => {
    it("存在するTodoを正常に取得する", async () => {
      const todoId = TestFactory.createTodoId("existing-todo-id")
      const todo = TestFactory.createTodo({
        id: todoId,
        title: "取得テスト",
        description: "取得用のテストタスク",
      })
      await mockRepository.save(todo)

      const result = await useCase.execute(todoId.getValue(), TEST_USER_ID)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(todoId.getValue())
      expect(result!.title).toBe("取得テスト")
      expect(result!.description).toBe("取得用のテストタスク")
      expect(result!.completed).toBe(false)
      expect(result!.created_at).toEqual(expect.any(String))
      expect(result!.updated_at).toEqual(expect.any(String))
    })

    it("完了状態のTodoを正常に取得する", async () => {
      const todoId = TestFactory.createTodoId("completed-todo-id")
      const todoWithId = TestFactory.createTodo({
        id: todoId,
        title: "完了済みタスク",
        description: "完了したタスク",
      })
      todoWithId.complete()
      await mockRepository.save(todoWithId)

      const result = await useCase.execute(todoId.getValue(), TEST_USER_ID)

      expect(result).not.toBeNull()
      expect(result!.completed).toBe(true)
    })

    it("存在しないTodoに対してnullを返す", async () => {
      const nonExistentId = "non-existent-id"

      const result = await useCase.execute(nonExistentId, TEST_USER_ID)

      expect(result).toBeNull()
    })

    it("無効なTodoId文字列でエラーを投げる", async () => {
      await expect(useCase.execute("", TEST_USER_ID)).rejects.toThrow(
        "TodoId cannot be empty"
      )
    })

    it("複数のTodoが存在する中から正しいTodoを取得する", async () => {
      const todo1Id = TestFactory.createTodoId("todo-1")
      const todo2Id = TestFactory.createTodoId("todo-2")
      const todo3Id = TestFactory.createTodoId("todo-3")

      const todo1 = TestFactory.createTodo({ id: todo1Id, title: "タスク1" })
      const todo2 = TestFactory.createTodo({ id: todo2Id, title: "タスク2" })
      const todo3 = TestFactory.createTodo({ id: todo3Id, title: "タスク3" })

      await mockRepository.save(todo1)
      await mockRepository.save(todo2)
      await mockRepository.save(todo3)

      const result = await useCase.execute(todo2Id.getValue(), TEST_USER_ID)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(todo2Id.getValue())
      expect(result!.title).toBe("タスク2")
    })

    it("説明が空文字のTodoを正常に取得する", async () => {
      const todoId = TestFactory.createTodoId("no-description-id")
      const todo = TestFactory.createTodo({
        id: todoId,
        title: "説明なしタスク",
        description: undefined,
      })
      await mockRepository.save(todo)

      const result = await useCase.execute(todoId.getValue(), TEST_USER_ID)

      expect(result).not.toBeNull()
      expect(result!.description).toBe("")
    })

    it("他のユーザーのTodoにはアクセスできない", async () => {
      const todoId = TestFactory.createTodoId("other-user-todo")
      const todo = TestFactory.createTodo({
        id: todoId,
        userId: OTHER_USER_ID,
        title: "他ユーザーのタスク",
      })
      await mockRepository.save(todo)

      const result = await useCase.execute(todoId.getValue(), TEST_USER_ID)

      expect(result).toBeNull()
    })
  })
})
