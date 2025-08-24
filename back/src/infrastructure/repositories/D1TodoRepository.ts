import { desc, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/d1"
import type { ITodoRepository } from "../../application/repositories/ITodoRepository"
import { Todo } from "../../domain/entities/Todo"
import { TodoId } from "../../domain/value-objects/TodoId"
import { todosTable } from "../database/todoTable"

/**
 * D1データベースを使用したTodoリポジトリの実装
 * CloudflareのD1データベースに対してCRUD操作を行う
 */
export class D1TodoRepository implements ITodoRepository {
  private readonly drizzle

  /**
   * D1TodoRepositoryを初期化する
   * @param db D1データベースインスタンス
   */
  constructor(db: D1Database) {
    this.drizzle = drizzle(db)
  }

  /**
   * Todoをデータベースに保存する
   * @param todo 保存するTodoエンティティ
   */
  async save(todo: Todo): Promise<void> {
    await this.drizzle.insert(todosTable).values({
      id: todo.getId().toString(),
      title: todo.getTitle(),
      description: todo.getDescription(),
      completed: todo.getStatus().toBoolean(),
      createdAt: todo.getCreatedAt().toISOString(),
      updatedAt: todo.getUpdatedAt().toISOString(),
    })
  }

  /**
   * 指定されたIDのTodoを取得する
   * @param id 取得するTodoのID
   * @returns 見つかったTodoエンティティ、または見つからない場合はnull
   */
  async findById(id: TodoId): Promise<Todo | null> {
    const result = await this.drizzle
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id.toString()))
      .get()

    if (!result) {
      return null
    }

    return Todo.fromData({
      id: result.id,
      title: result.title,
      description: result.description,
      completed: result.completed ? 1 : 0,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
    })
  }

  /**
   * 全てのTodoを取得する
   * @returns 全てのTodoエンティティの配列（作成日時の降順でソート）
   */
  async findAll(): Promise<Todo[]> {
    const results = await this.drizzle
      .select()
      .from(todosTable)
      .orderBy(desc(todosTable.createdAt))
      .all()

    return results.map((result) =>
      Todo.fromData({
        id: result.id,
        title: result.title,
        description: result.description,
        completed: result.completed ? 1 : 0,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      })
    )
  }

  /**
   * Todoを更新する
   * @param todo 更新するTodoエンティティ
   */
  async update(todo: Todo): Promise<void> {
    await this.drizzle
      .update(todosTable)
      .set({
        title: todo.getTitle(),
        description: todo.getDescription(),
        completed: todo.getStatus().toBoolean(),
        updatedAt: todo.getUpdatedAt().toISOString(),
      })
      .where(eq(todosTable.id, todo.getId().toString()))
  }

  /**
   * 指定されたIDのTodoを削除する
   * @param id 削除するTodoのID
   */
  async delete(id: TodoId): Promise<void> {
    await this.drizzle
      .delete(todosTable)
      .where(eq(todosTable.id, id.toString()))
  }
}
