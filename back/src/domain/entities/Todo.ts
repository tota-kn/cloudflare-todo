import { TodoId } from "../value-objects/TodoId"
import { TodoStatus } from "../value-objects/TodoStatus"

/**
 * Todoエンティティ
 * 業務ロジックを含むTodoの中心的なオブジェクト
 */
export class Todo {
  private constructor(
    private readonly id: TodoId,
    private title: string,
    private description: string,
    private status: TodoStatus,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {
    this.validateTitle()
  }

  /**
   * 新しいTodoを作成する
   * @param id TodoのID
   * @param title Todoのタイトル
   * @param description Todoの説明（オプション）
   * @returns 作成されたTodoインスタンス
   */
  static create(id: TodoId, title: string, description?: string): Todo {
    const now = new Date()
    return new Todo(
      id,
      title,
      description || "",
      TodoStatus.pending(),
      now,
      now
    )
  }

  /**
   * データベースから取得した生データからTodoインスタンスを作成する
   * @param data データベースの生データ
   * @returns 作成されたTodoインスタンス
   */
  static fromData(data: {
    id: string
    title: string
    description: string
    completed: number
    created_at: string
    updated_at: string
  }): Todo {
    return new Todo(
      new TodoId(data.id),
      data.title,
      data.description || "",
      data.completed === 1 ? TodoStatus.completed() : TodoStatus.pending(),
      new Date(data.created_at),
      new Date(data.updated_at)
    )
  }

  /**
   * タイトルのバリデーションを行う
   * @throws {Error} タイトルが空の場合にエラーを投げる
   */
  private validateTitle(): void {
    if (!this.title || this.title === "") {
      throw new Error("Todo title cannot be empty")
    }
  }

  /**
   * TodoのIDを取得する
   * @returns TodoのID
   */
  getId(): TodoId {
    return this.id
  }

  /**
   * Todoのタイトルを取得する
   * @returns Todoのタイトル
   */
  getTitle(): string {
    return this.title
  }

  /**
   * Todoの説明を取得する
   * @returns Todoの説明
   */
  getDescription(): string {
    return this.description
  }

  /**
   * Todoのステータスを取得する
   * @returns Todoのステータス
   */
  getStatus(): TodoStatus {
    return this.status
  }

  /**
   * Todoの作成日時を取得する
   * @returns Todoの作成日時
   */
  getCreatedAt(): Date {
    return this.createdAt
  }

  /**
   * Todoの更新日時を取得する
   * @returns Todoの更新日時
   */
  getUpdatedAt(): Date {
    return this.updatedAt
  }

  /**
   * Todoのタイトルを更新する
   * @param title 新しいタイトル
   */
  updateTitle(title: string): void {
    this.title = title
    this.validateTitle()
    this.updatedAt = new Date()
  }

  /**
   * Todoの説明を更新する
   * @param description 新しい説明
   */
  updateDescription(description: string): void {
    this.description = description
    this.updatedAt = new Date()
  }

  /**
   * Todoを完了済みに設定する
   */
  complete(): void {
    this.status = TodoStatus.completed()
    this.updatedAt = new Date()
  }

  /**
   * Todoを未完了に設定する
   */
  markAsPending(): void {
    this.status = TodoStatus.pending()
    this.updatedAt = new Date()
  }

  /**
   * Todoのステータスを切り替える（完了⇔未完了）
   */
  toggleStatus(): void {
    this.status = this.status.toggle()
    this.updatedAt = new Date()
  }
}
