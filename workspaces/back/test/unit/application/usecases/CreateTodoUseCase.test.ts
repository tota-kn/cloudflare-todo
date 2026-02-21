import { describe, it, expect, beforeEach, vi } from "vitest"
import { CreateTodoUseCase } from "../../../../src/application/usecases/CreateTodoUseCase"
import { MockTodoRepository } from "../../mocks/MockTodoRepository"
import { TestFactory } from "../../mocks/TestFactory"
import { TodoId } from "../../../../src/domain/value-objects/TodoId"

// crypto.randomUUIDをモック化
const mockUUID = "test-uuid-123"
vi.stubGlobal("crypto", {
  randomUUID: () => mockUUID,
})

const TEST_USER_ID = TestFactory.DEFAULT_USER_ID

describe("CreateTodoUseCase", () => {
  let useCase: CreateTodoUseCase
  let mockRepository: MockTodoRepository

  beforeEach(() => {
    mockRepository = new MockTodoRepository()
    useCase = new CreateTodoUseCase(mockRepository)
  })

  describe("execute()", () => {
    it("正常にTodoを作成する", async () => {
      const request = {
        userId: TEST_USER_ID,
        title: "テストタスク",
        description: "テスト用の説明",
      }

      const result = await useCase.execute(request)

      expect(result).toEqual({
        id: mockUUID,
        title: request.title,
        description: request.description,
        completed: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })

      // リポジトリに保存されたことを確認
      expect(mockRepository.has(new TodoId(mockUUID))).toBe(true)
      expect(mockRepository.size()).toBe(1)
    })

    it("説明なしでTodoを作成する", async () => {
      const request = {
        userId: TEST_USER_ID,
        title: "タイトルのみ",
      }

      const result = await useCase.execute(request)

      expect(result).toEqual({
        id: mockUUID,
        title: request.title,
        description: "",
        completed: false,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })

      expect(mockRepository.has(new TodoId(mockUUID))).toBe(true)
    })

    it("作成されたTodoのステータスが未完了である", async () => {
      const request = {
        userId: TEST_USER_ID,
        title: "ステータステスト",
      }

      const result = await useCase.execute(request)

      expect(result.completed).toBe(false)

      const savedTodo = await mockRepository.findById(
        new TodoId(mockUUID),
        TEST_USER_ID
      )
      expect(savedTodo!.getStatus().isPending()).toBe(true)
    })

    it("UUIDが正しく設定される", async () => {
      const request = {
        userId: TEST_USER_ID,
        title: "UUIDテスト",
      }

      const result = await useCase.execute(request)

      expect(result.id).toBe(mockUUID)

      const savedTodo = await mockRepository.findById(
        new TodoId(mockUUID),
        TEST_USER_ID
      )
      expect(savedTodo!.getId().getValue()).toBe(mockUUID)
    })

    it("複数のTodoを作成できる", async () => {
      // 異なるUUIDを生成するよう設定
      let callCount = 0
      vi.stubGlobal("crypto", {
        randomUUID: () => `uuid-${callCount++}`,
      })

      const request1 = { userId: TEST_USER_ID, title: "タスク1" }
      const request2 = { userId: TEST_USER_ID, title: "タスク2" }

      await useCase.execute(request1)
      await useCase.execute(request2)

      expect(mockRepository.size()).toBe(2)
      expect(mockRepository.has(new TodoId("uuid-0"))).toBe(true)
      expect(mockRepository.has(new TodoId("uuid-1"))).toBe(true)
    })
  })
})
