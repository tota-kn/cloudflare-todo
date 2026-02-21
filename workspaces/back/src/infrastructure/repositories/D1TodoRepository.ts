import { and, desc, eq } from "drizzle-orm"
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
      userId: todo.getUserId(),
      title: todo.getTitle(),
      description: todo.getDescription(),
      completed: todo.getStatus().toBoolean(),
      createdAt: todo.getCreatedAt().toISOString(),
      updatedAt: todo.getUpdatedAt().toISOString(),
    })
  }

  /**
   * 指定ユーザーの特定IDのTodoを取得する
   * @param id 取得するTodoのID
   * @param userId ユーザーID
   * @returns 見つかったTodoエンティティ、または見つからない場合はnull
   */
  async findById(id: TodoId, userId: string): Promise<Todo | null> {
    const result = await this.drizzle
      .select()
      .from(todosTable)
      .where(
        and(eq(todosTable.id, id.toString()), eq(todosTable.userId, userId))
      )
      .get()

    if (!result) {
      return null
    }

    return Todo.fromData({
      id: result.id,
      user_id: result.userId,
      title: result.title,
      description: result.description,
      completed: result.completed ? 1 : 0,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
    })
  }

  /**
   * 指定ユーザーの全Todoを取得する
   * @param userId ユーザーID
   * @returns 全てのTodoエンティティの配列（作成日時の降順でソート）
   */
  async findAll(userId: string): Promise<Todo[]> {
    const results = await this.drizzle
      .select()
      .from(todosTable)
      .where(eq(todosTable.userId, userId))
      .orderBy(desc(todosTable.createdAt))
      .all()

    return results.map((result) =>
      Todo.fromData({
        id: result.id,
        user_id: result.userId,
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
   * @remarks
   * WHERE句にuserIdを含めることで、ユースケース層のfindByIdチェックが
   * 漏れた場合でも他ユーザーのTodoを上書きしないようにするための安全弁。
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
      .where(
        and(
          eq(todosTable.id, todo.getId().toString()),
          eq(todosTable.userId, todo.getUserId())
        )
      )
  }

  /**
   * 指定ユーザーの特定IDのTodoを削除する
   * @param id 削除するTodoのID
   * @param userId ユーザーID
   */
  async delete(id: TodoId, userId: string): Promise<void> {
    await this.drizzle
      .delete(todosTable)
      .where(
        and(eq(todosTable.id, id.toString()), eq(todosTable.userId, userId))
      )
  }
}
