import { describe, expect, it } from 'vitest'
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
  })

  describe('getValue()', () => {
    it('正しい値を返す', () => {
      const id = 'test-id-456'
      const todoId = new TodoId(id)

      expect(todoId.getValue()).toBe(id)
    })
  })

  describe('toString()', () => {
    it('正しい文字列表現を返す', () => {
      const id = 'test-id-456'
      const todoId = new TodoId(id)

      expect(todoId.toString()).toBe(id)
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
  })
})
