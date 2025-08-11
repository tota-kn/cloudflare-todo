import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateTodoUseCase } from '../../../../src/application/usecases/UpdateTodoUseCase'
import { MockTodoRepository } from '../../mocks/MockTodoRepository'
import { TestFactory } from '../../mocks/TestFactory'
import { TodoId } from '../../../../src/domain/value-objects/TodoId'

describe('UpdateTodoUseCase', () => {
  let useCase: UpdateTodoUseCase
  let mockRepository: MockTodoRepository

  beforeEach(() => {
    mockRepository = new MockTodoRepository()
    useCase = new UpdateTodoUseCase(mockRepository)
  })

  describe('execute()', () => {
    it('存在するTodoのタイトルを更新する', async () => {
      const todoId = TestFactory.createTodoId('update-test-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: '元のタイトル',
        description: '元の説明',
      })
      await mockRepository.save(todo)

      const request = {
        todoId: todoId.getValue(),
        title: '更新されたタイトル',
      }

      const result = await useCase.execute(request)

      expect(result).not.toBeNull()
      expect(result!.title).toBe('更新されたタイトル')
      expect(result!.description).toBe('元の説明') // 変更されていない
      expect(result!.completed).toBe(false) // 変更されていない

      // リポジトリの状態も確認
      const updatedTodo = await mockRepository.findById(todoId)
      expect(updatedTodo!.getTitle()).toBe('更新されたタイトル')
    })

    it('存在するTodoの説明を更新する', async () => {
      const todoId = TestFactory.createTodoId('update-desc-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: 'タイトル',
        description: '元の説明',
      })
      await mockRepository.save(todo)

      const request = {
        todoId: todoId.getValue(),
        description: '更新された説明',
      }

      const result = await useCase.execute(request)

      expect(result).not.toBeNull()
      expect(result!.title).toBe('タイトル') // 変更されていない
      expect(result!.description).toBe('更新された説明')
      expect(result!.completed).toBe(false) // 変更されていない
    })

    it('存在するTodoの完了状態をtrueに更新する', async () => {
      const todoId = TestFactory.createTodoId('complete-test-id')
      const todo = TestFactory.createPendingTodo('未完了タスク')
      // IDを手動で設定
      const todoWithId = TestFactory.createTodo({
        id: todoId,
        title: '未完了タスク',
      })
      await mockRepository.save(todoWithId)

      const request = {
        todoId: todoId.getValue(),
        completed: true,
      }

      const result = await useCase.execute(request)

      expect(result).not.toBeNull()
      expect(result!.completed).toBe(true)

      // リポジトリの状態も確認
      const updatedTodo = await mockRepository.findById(todoId)
      expect(updatedTodo!.getStatus().isCompleted()).toBe(true)
    })

    it('存在するTodoの完了状態をfalseに更新する', async () => {
      const todoId = TestFactory.createTodoId('incomplete-test-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: '完了タスク',
      })
      todo.complete()
      await mockRepository.save(todo)

      const request = {
        todoId: todoId.getValue(),
        completed: false,
      }

      const result = await useCase.execute(request)

      expect(result).not.toBeNull()
      expect(result!.completed).toBe(false)

      // リポジトリの状態も確認
      const updatedTodo = await mockRepository.findById(todoId)
      expect(updatedTodo!.getStatus().isPending()).toBe(true)
    })

    it('複数のフィールドを同時に更新する', async () => {
      const todoId = TestFactory.createTodoId('multi-update-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: '元のタイトル',
        description: '元の説明',
      })
      await mockRepository.save(todo)

      const request = {
        todoId: todoId.getValue(),
        title: '新しいタイトル',
        description: '新しい説明',
        completed: true,
      }

      const result = await useCase.execute(request)

      expect(result).not.toBeNull()
      expect(result!.title).toBe('新しいタイトル')
      expect(result!.description).toBe('新しい説明')
      expect(result!.completed).toBe(true)
    })

    it('説明をnullに更新する', async () => {
      const todoId = TestFactory.createTodoId('null-desc-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: 'タイトル',
        description: '削除される説明',
      })
      await mockRepository.save(todo)

      const request = {
        todoId: todoId.getValue(),
        description: null,
      }

      const result = await useCase.execute(request)

      expect(result).not.toBeNull()
      expect(result!.description).toBeNull()

      // リポジトリの状態も確認
      const updatedTodo = await mockRepository.findById(todoId)
      expect(updatedTodo!.getDescription()).toBeNull()
    })

    it('存在しないTodoに対してnullを返す', async () => {
      const request = {
        todoId: 'non-existent-id',
        title: '更新タイトル',
      }

      const result = await useCase.execute(request)

      expect(result).toBeNull()
    })

    it('無効なTodoId文字列でエラーを投げる', async () => {
      const request = {
        todoId: '',
        title: '更新タイトル',
      }

      await expect(useCase.execute(request)).rejects.toThrow('TodoId cannot be empty')
    })

    it('空のタイトルでエラーを投げる', async () => {
      const todoId = TestFactory.createTodoId('empty-title-id')
      const todo = TestFactory.createTodo({ id: todoId, title: '元のタイトル' })
      await mockRepository.save(todo)

      const request = {
        todoId: todoId.getValue(),
        title: '',
      }

      await expect(useCase.execute(request)).rejects.toThrow('Todo title cannot be empty')
    })

    it('何もフィールドを指定しない場合でも正常に動作する', async () => {
      const todoId = TestFactory.createTodoId('no-change-id')
      const todo = TestFactory.createTodo({
        id: todoId,
        title: '変更なしタイトル',
        description: '変更なし説明',
      })
      await mockRepository.save(todo)

      const request = {
        todoId: todoId.getValue(),
      }

      const result = await useCase.execute(request)

      expect(result).not.toBeNull()
      expect(result!.title).toBe('変更なしタイトル')
      expect(result!.description).toBe('変更なし説明')
      expect(result!.completed).toBe(false)
    })
  })
})
