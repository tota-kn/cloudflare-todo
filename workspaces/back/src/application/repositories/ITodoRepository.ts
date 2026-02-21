import { Todo } from "../../domain/entities/Todo"
import { TodoId } from "../../domain/value-objects/TodoId"

export interface ITodoRepository {
  /** Todoを保存する */
  save(todo: Todo): Promise<void>
  /** 指定ユーザーの特定IDのTodoを取得する */
  findById(id: TodoId, userId: string): Promise<Todo | null>
  /** 指定ユーザーの全Todoを取得する */
  findAll(userId: string): Promise<Todo[]>
  /** Todoを更新する */
  update(todo: Todo): Promise<void>
  /** 指定ユーザーの特定IDのTodoを削除する */
  delete(id: TodoId, userId: string): Promise<void>
}
