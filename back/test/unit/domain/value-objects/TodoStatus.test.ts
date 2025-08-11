import { describe, it, expect } from 'vitest'
import { TodoStatus } from '../../../../src/domain/value-objects/TodoStatus'

describe('TodoStatus', () => {
  describe('ファクトリーメソッド', () => {
    it('completed()で完了状態のTodoStatusを作成する', () => {
      const status = TodoStatus.completed()

      expect(status.isCompleted()).toBe(true)
      expect(status.isPending()).toBe(false)
      expect(status.toBoolean()).toBe(true)
    })

    it('pending()で未完了状態のTodoStatusを作成する', () => {
      const status = TodoStatus.pending()

      expect(status.isCompleted()).toBe(false)
      expect(status.isPending()).toBe(true)
      expect(status.toBoolean()).toBe(false)
    })
  })

  describe('状態判定メソッド', () => {
    it('isCompleted()が正しく動作する', () => {
      const completedStatus = TodoStatus.completed()
      const pendingStatus = TodoStatus.pending()

      expect(completedStatus.isCompleted()).toBe(true)
      expect(pendingStatus.isCompleted()).toBe(false)
    })

    it('isPending()が正しく動作する', () => {
      const completedStatus = TodoStatus.completed()
      const pendingStatus = TodoStatus.pending()

      expect(completedStatus.isPending()).toBe(false)
      expect(pendingStatus.isPending()).toBe(true)
    })

    it('toBoolean()が正しく動作する', () => {
      const completedStatus = TodoStatus.completed()
      const pendingStatus = TodoStatus.pending()

      expect(completedStatus.toBoolean()).toBe(true)
      expect(pendingStatus.toBoolean()).toBe(false)
    })
  })

  describe('状態変更', () => {
    it('toggle()で完了状態を未完了に変更する', () => {
      const completedStatus = TodoStatus.completed()
      const toggledStatus = completedStatus.toggle()

      expect(toggledStatus.isPending()).toBe(true)
      expect(toggledStatus.isCompleted()).toBe(false)
    })

    it('toggle()で未完了状態を完了に変更する', () => {
      const pendingStatus = TodoStatus.pending()
      const toggledStatus = pendingStatus.toggle()

      expect(toggledStatus.isCompleted()).toBe(true)
      expect(toggledStatus.isPending()).toBe(false)
    })

    it('toggle()は元のオブジェクトを変更しない（イミュータブル）', () => {
      const originalStatus = TodoStatus.pending()
      const toggledStatus = originalStatus.toggle()

      expect(originalStatus.isPending()).toBe(true)
      expect(toggledStatus.isCompleted()).toBe(true)
    })
  })
})
