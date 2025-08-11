import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteTodoUseCase } from '../../../../src/application/usecases/DeleteTodoUseCase'
import { MockTodoRepository } from '../../mocks/MockTodoRepository'
import { TestFactory } from '../../mocks/TestFactory'
import { TodoId } from '../../../../src/domain/value-objects/TodoId'

describe('DeleteTodoUseCase', () => {
  let useCase: DeleteTodoUseCase
  let mockRepository: MockTodoRepository

  beforeEach(() => {
    mockRepository = new MockTodoRepository()
    useCase = new DeleteTodoUseCase(mockRepository)
  })

  describe('execute()', () => {
    it('存在するTodoを正常に削除する', async () => {
      const todoId = TestFactory.createTodoId('delete-test-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: '削除対象タスク',
        description: '削除されるタスク',
      })
      await mockRepository.save(todo)

      // 削除前の状態確認
      expect(mockRepository.has(todoId)).toBe(true)
      expect(mockRepository.size()).toBe(1)

      const result = await useCase.execute(todoId.getValue())

      expect(result).toBe(true)
      // 削除後の状態確認
      expect(mockRepository.has(todoId)).toBe(false)
      expect(mockRepository.size()).toBe(0)
    })

    it('完了状態のTodoを正常に削除する', async () => {
      const todoId = TestFactory.createTodoId('delete-completed-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: '完了済み削除対象',
      })
      todo.complete()
      await mockRepository.save(todo)

      expect(mockRepository.has(todoId)).toBe(true)

      const result = await useCase.execute(todoId.getValue())

      expect(result).toBe(true)
      expect(mockRepository.has(todoId)).toBe(false)
    })

    it('存在しないTodoに対してfalseを返す', async () => {
      const nonExistentId = 'non-existent-id'

      const result = await useCase.execute(nonExistentId)

      expect(result).toBe(false)
      expect(mockRepository.size()).toBe(0)
    })

    it('複数のTodoがある中から特定のTodoを削除する', async () => {
      const todoId1 = TestFactory.createTodoId('todo-1')
      const todoId2 = TestFactory.createTodoId('todo-2')
      const todoId3 = TestFactory.createTodoId('todo-3')

      const todo1 = TestFactory.createTodo({ id: todoId1, title: 'タスク1' })
      const todo2 = TestFactory.createTodo({ id: todoId2, title: 'タスク2' })
      const todo3 = TestFactory.createTodo({ id: todoId3, title: 'タスク3' })

      await mockRepository.save(todo1)
      await mockRepository.save(todo2)
      await mockRepository.save(todo3)

      expect(mockRepository.size()).toBe(3)

      const result = await useCase.execute(todoId2.getValue())

      expect(result).toBe(true)
      expect(mockRepository.size()).toBe(2)
      expect(mockRepository.has(todoId1)).toBe(true)
      expect(mockRepository.has(todoId2)).toBe(false) // 削除された
      expect(mockRepository.has(todoId3)).toBe(true)
    })

    it('無効なTodoId文字列でエラーを投げる', async () => {
      await expect(useCase.execute('')).rejects.toThrow('TodoId cannot be empty')
      await expect(useCase.execute('   ')).rejects.toThrow('TodoId cannot be empty')
    })

    it('同じTodoを二回削除しようとした場合、二回目はfalseを返す', async () => {
      const todoId = TestFactory.createTodoId('double-delete-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: '二回削除対象',
      })
      await mockRepository.save(todo)

      // 一回目の削除
      const firstResult = await useCase.execute(todoId.getValue())
      expect(firstResult).toBe(true)
      expect(mockRepository.has(todoId)).toBe(false)

      // 二回目の削除
      const secondResult = await useCase.execute(todoId.getValue())
      expect(secondResult).toBe(false)
      expect(mockRepository.size()).toBe(0)
    })

    it('削除操作がリポジトリに正しく反映される', async () => {
      const todoId1 = TestFactory.createTodoId('persist-test-1')
      const todoId2 = TestFactory.createTodoId('persist-test-2')

      const todo1 = TestFactory.createTodo({ id: todoId1, title: 'タスク1' })
      const todo2 = TestFactory.createTodo({ id: todoId2, title: 'タスク2' })

      await mockRepository.save(todo1)
      await mockRepository.save(todo2)

      // todo1を削除
      await useCase.execute(todoId1.getValue())

      // findById で確認
      const remaining = await mockRepository.findById(todoId1)
      const stillExists = await mockRepository.findById(todoId2)

      expect(remaining).toBeNull()
      expect(stillExists).not.toBeNull()
      expect(stillExists!.getTitle()).toBe('タスク2')
    })

    it('大量のTodoから特定のTodoを削除する', async () => {
      const todoCount = 50
      const todos = Array.from({ length: todoCount }, (_, i) => {
        const id = TestFactory.createTodoId(`mass-delete-${i}`)
        return TestFactory.createTodo({
          id,
          title: `タスク${i + 1}`,
        })
      })

      // 全て保存
      for (const todo of todos) {
        await mockRepository.save(todo)
      }

      expect(mockRepository.size()).toBe(todoCount)

      // 中間のTodoを削除
      const targetIndex = 25
      const targetTodo = todos[targetIndex]
      const result = await useCase.execute(targetTodo.getId().getValue())

      expect(result).toBe(true)
      expect(mockRepository.size()).toBe(todoCount - 1)
      expect(mockRepository.has(targetTodo.getId())).toBe(false)
    })
  })
})
