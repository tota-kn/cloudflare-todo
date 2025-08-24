/**
 * Todoのステータスを表す値オブジェクト
 * 完了済み（completed）または未完了（pending）の状態を管理する
 */
export class TodoStatus {
  private constructor(private readonly value: boolean) {}

  /**
   * 完了済みステータスを作成する
   * @returns 完了済みのTodoStatus
   */
  static completed(): TodoStatus {
    return new TodoStatus(true)
  }

  /**
   * 未完了ステータスを作成する
   * @returns 未完了のTodoStatus
   */
  static pending(): TodoStatus {
    return new TodoStatus(false)
  }

  /**
   * ステータスが完了済みかどうかを判定する
   * @returns 完了済みの場合はtrue、そうでなければfalse
   */
  isCompleted(): boolean {
    return this.value
  }

  /**
   * ステータスが未完了かどうかを判定する
   * @returns 未完了の場合はtrue、そうでなければfalse
   */
  isPending(): boolean {
    return !this.value
  }

  /**
   * ステータスを切り替える（完了⇔未完了）
   * @returns 切り替え後の新しいTodoStatus
   */
  toggle(): TodoStatus {
    return new TodoStatus(!this.value)
  }

  /**
   * ステータスをboolean値として取得する
   * @returns 完了済みの場合はtrue、未完了の場合はfalse
   */
  toBoolean(): boolean {
    return this.value
  }
}
