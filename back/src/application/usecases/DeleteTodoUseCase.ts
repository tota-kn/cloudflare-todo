import { TodoId } from "../../domain/value-objects/TodoId"
import type { ITodoRepository } from "../repositories/ITodoRepository"

/**
 * Todo削除ユースケース
 * 指定されたTodoを削除する
 */
export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * Todoを削除する
   * @param id 削除するTodoのID文字列
   * @returns 削除が成功した場合はtrue、Todoが見つからない場合はfalse
   */
  async execute(id: string): Promise<boolean> {
    const todoId = new TodoId(id)
    const todo = await this.todoRepository.findById(todoId)

    if (!todo) {
      return false
    }

    await this.todoRepository.delete(todoId)

    return true
  }
}
