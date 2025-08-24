import { describe, it, expect, beforeEach, vi } from "vitest"
import { CreateTodoUseCase } from "../../../../src/application/usecases/CreateTodoUseCase"
import { MockTodoRepository } from "../../mocks/MockTodoRepository"
import { TodoId } from "../../../../src/domain/value-objects/TodoId"

// crypto.randomUUIDをモック化
const mockUUID = "test-uuid-123"
vi.stubGlobal("crypto", {
  randomUUID: () => mockUUID,
})

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
        title: "ステータステスト",
      }

      const result = await useCase.execute(request)

      expect(result.completed).toBe(false)

      const savedTodo = await mockRepository.findById(new TodoId(mockUUID))
      expect(savedTodo!.getStatus().isPending()).toBe(true)
    })

    it("UUIDが正しく設定される", async () => {
      const request = {
        title: "UUIDテスト",
      }

      const result = await useCase.execute(request)

      expect(result.id).toBe(mockUUID)

      const savedTodo = await mockRepository.findById(new TodoId(mockUUID))
      expect(savedTodo!.getId().getValue()).toBe(mockUUID)
    })

    it("複数のTodoを作成できる", async () => {
      // 異なるUUIDを生成するよう設定
      let callCount = 0
      vi.stubGlobal("crypto", {
        randomUUID: () => `uuid-${callCount++}`,
      })

      const request1 = { title: "タスク1" }
      const request2 = { title: "タスク2" }

      await useCase.execute(request1)
      await useCase.execute(request2)

      expect(mockRepository.size()).toBe(2)
      expect(mockRepository.has(new TodoId("uuid-0"))).toBe(true)
      expect(mockRepository.has(new TodoId("uuid-1"))).toBe(true)
    })
  })
})
