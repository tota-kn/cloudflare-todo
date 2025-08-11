import { describe, it, expect } from 'vitest'
import { TodoId } from '../../../../src/domain/value-objects/TodoId'

describe('TodoId', () => {
  describe('コンストラクタとバリデーション', () => {
    it('正常な値でTodoIdを作成する', () => {
      const id = 'test-todo-id-123'
      const todoId = new TodoId(id)

      expect(todoId.toString()).toBe(id)
    })

    it('空文字でエラーを投げる', () => {
      expect(() => new TodoId('')).toThrow('TodoId cannot be empty')
    })

    it('スペースのみの文字列でエラーを投げる', () => {
      expect(() => new TodoId('   ')).toThrow('TodoId cannot be empty')
    })

    it('nullish値でエラーを投げる', () => {
      expect(() => new TodoId(null as any)).toThrow('TodoId cannot be empty')
      expect(() => new TodoId(undefined as any)).toThrow('TodoId cannot be empty')
    })
  })

  describe('getValue()', () => {
    it('正しい値を返す', () => {
      const id = 'test-id-456'
      const todoId = new TodoId(id)

      expect(todoId.getValue()).toBe(id)
    })

    it('UUIDを正しく処理する', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const todoId = new TodoId(uuid)

      expect(todoId.getValue()).toBe(uuid)
    })
  })

  describe('toString()', () => {
    it('正しい文字列表現を返す', () => {
      const id = 'test-id-456'
      const todoId = new TodoId(id)

      expect(todoId.toString()).toBe(id)
    })

    it('UUIDを正しく処理する', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const todoId = new TodoId(uuid)

      expect(todoId.toString()).toBe(uuid)
    })
  })

  describe('equals()', () => {
    it('同じ値のTodoIdで等価判定がtrueを返す', () => {
      const id = 'same-id'
      const todoId1 = new TodoId(id)
      const todoId2 = new TodoId(id)

      expect(todoId1.equals(todoId2)).toBe(true)
    })

    it('異なる値のTodoIdで等価判定がfalseを返す', () => {
      const todoId1 = new TodoId('id-1')
      const todoId2 = new TodoId('id-2')

      expect(todoId1.equals(todoId2)).toBe(false)
    })

    it('大文字小文字を区別する', () => {
      const todoId1 = new TodoId('ID')
      const todoId2 = new TodoId('id')

      expect(todoId1.equals(todoId2)).toBe(false)
    })

    it('空白の違いを検出する', () => {
      const todoId1 = new TodoId('id')
      const todoId2 = new TodoId(' id ')

      expect(todoId1.equals(todoId2)).toBe(false)
    })
  })
})
