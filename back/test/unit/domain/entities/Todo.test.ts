import { describe, it, expect, beforeEach } from 'vitest'
import { Todo } from '../../../../src/domain/entities/Todo'
import { TodoId } from '../../../../src/domain/value-objects/TodoId'
import { TodoStatus } from '../../../../src/domain/value-objects/TodoStatus'
import { TestFactory } from '../../mocks/TestFactory'

describe('Todo', () => {
  let todoId: TodoId

  beforeEach(() => {
    todoId = TestFactory.createTodoId()
  })

  describe('コンストラクタとファクトリーメソッド', () => {
    describe('create()', () => {
      it('正常な値でTodoを作成する', () => {
        const title = 'テストタスク'
        const description = 'テスト用の説明'

        const todo = Todo.create(todoId, title, description)

        expect(todo.getId()).toBe(todoId)
        expect(todo.getTitle()).toBe(title)
        expect(todo.getDescription()).toBe(description)
        expect(todo.getStatus().isPending()).toBe(true)
        expect(todo.getCreatedAt()).toBeInstanceOf(Date)
        expect(todo.getUpdatedAt()).toBeInstanceOf(Date)
      })

      it('説明なしでTodoを作成する', () => {
        const title = 'タイトルのみ'

        const todo = Todo.create(todoId, title)

        expect(todo.getId()).toBe(todoId)
        expect(todo.getTitle()).toBe(title)
        expect(todo.getDescription()).toBeNull()
        expect(todo.getStatus().isPending()).toBe(true)
      })
    })

    describe('fromData()', () => {
      it('データベース形式からTodoを作成する', () => {
        const data = {
          id: 'test-id-123',
          title: 'データベースタスク',
          description: 'DB形式のデータ',
          completed: 0,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-02T00:00:00.000Z',
        }

        const todo = Todo.fromData(data)

        expect(todo.getId().getValue()).toBe(data.id)
        expect(todo.getTitle()).toBe(data.title)
        expect(todo.getDescription()).toBe(data.description)
        expect(todo.getStatus().isPending()).toBe(true)
        expect(todo.getCreatedAt()).toEqual(new Date(data.created_at))
        expect(todo.getUpdatedAt()).toEqual(new Date(data.updated_at))
      })

      it('完了状態のTodoをデータベース形式から作成する', () => {
        const data = {
          id: 'completed-id',
          title: '完了タスク',
          description: null,
          completed: 1,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-02T00:00:00.000Z',
        }

        const todo = Todo.fromData(data)

        expect(todo.getStatus().isCompleted()).toBe(true)
        expect(todo.getDescription()).toBeNull()
      })
    })
  })

  describe('バリデーション', () => {
    it('空のタイトルでエラーを投げる', () => {
      expect(() => Todo.create(todoId, '')).toThrow('Todo title cannot be empty')
    })

    it('スペースのみのタイトルでエラーを投げる', () => {
      expect(() => Todo.create(todoId, '   ')).toThrow('Todo title cannot be empty')
    })
  })

  describe('ゲッターメソッド', () => {
    let todo: Todo

    beforeEach(() => {
      todo = TestFactory.createTodo({
        id: todoId,
        title: 'テストタスク',
        description: 'テスト説明',
      })
    })

    it('getId()が正しいIDを返す', () => {
      expect(todo.getId()).toBe(todoId)
    })

    it('getTitle()が正しいタイトルを返す', () => {
      expect(todo.getTitle()).toBe('テストタスク')
    })

    it('getDescription()が正しい説明を返す', () => {
      expect(todo.getDescription()).toBe('テスト説明')
    })

    it('getStatus()が正しいステータスを返す', () => {
      expect(todo.getStatus().isPending()).toBe(true)
    })

    it('getCreatedAt()とgetUpdatedAt()がDateインスタンスを返す', () => {
      expect(todo.getCreatedAt()).toBeInstanceOf(Date)
      expect(todo.getUpdatedAt()).toBeInstanceOf(Date)
    })
  })

  describe('更新メソッド', () => {
    let todo: Todo
    const originalUpdatedAt = new Date('2024-01-01T00:00:00.000Z')

    beforeEach(() => {
      todo = TestFactory.createTodo({
        id: todoId,
        title: '元のタイトル',
        description: '元の説明',
      })
      // 更新時間の変化をテストするため、手動で古い時間を設定
      const originalTodo = todo as any
      originalTodo.updatedAt = originalUpdatedAt
    })

    describe('updateTitle()', () => {
      it('タイトルを更新し、updatedAtも更新する', () => {
        const newTitle = '新しいタイトル'

        todo.updateTitle(newTitle)

        expect(todo.getTitle()).toBe(newTitle)
        expect(todo.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })

      it('空のタイトルでエラーを投げる', () => {
        expect(() => todo.updateTitle('')).toThrow('Todo title cannot be empty')
      })
    })

    describe('updateDescription()', () => {
      it('説明を更新し、updatedAtも更新する', () => {
        const newDescription = '新しい説明'

        todo.updateDescription(newDescription)

        expect(todo.getDescription()).toBe(newDescription)
        expect(todo.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })

      it('説明をnullに設定できる', () => {
        todo.updateDescription(null)

        expect(todo.getDescription()).toBeNull()
        expect(todo.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })
    })
  })

  describe('ステータス変更メソッド', () => {
    let todo: Todo
    const originalUpdatedAt = new Date('2024-01-01T00:00:00.000Z')

    beforeEach(() => {
      todo = TestFactory.createTodo({ id: todoId })
      const originalTodo = todo as any
      originalTodo.updatedAt = originalUpdatedAt
    })

    describe('complete()', () => {
      it('ステータスを完了に変更し、updatedAtも更新する', () => {
        expect(todo.getStatus().isPending()).toBe(true)

        todo.complete()

        expect(todo.getStatus().isCompleted()).toBe(true)
        expect(todo.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })
    })

    describe('markAsPending()', () => {
      it('ステータスを未完了に変更し、updatedAtも更新する', () => {
        todo.complete()
        expect(todo.getStatus().isCompleted()).toBe(true)

        const todoAny = todo as any
        todoAny.updatedAt = originalUpdatedAt

        todo.markAsPending()

        expect(todo.getStatus().isPending()).toBe(true)
        expect(todo.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })
    })

    describe('toggleStatus()', () => {
      it('未完了から完了に変更し、updatedAtも更新する', () => {
        expect(todo.getStatus().isPending()).toBe(true)

        todo.toggleStatus()

        expect(todo.getStatus().isCompleted()).toBe(true)
        expect(todo.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })

      it('完了から未完了に変更し、updatedAtも更新する', () => {
        todo.complete()
        expect(todo.getStatus().isCompleted()).toBe(true)

        const todoAny = todo as any
        todoAny.updatedAt = originalUpdatedAt

        todo.toggleStatus()

        expect(todo.getStatus().isPending()).toBe(true)
        expect(todo.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      })
    })
  })
})
