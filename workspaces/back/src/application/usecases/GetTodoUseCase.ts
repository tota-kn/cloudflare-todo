import { TodoId } from "../../domain/value-objects/TodoId"
import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

/**
 * Todo取得ユースケース
 * 指定されたIDのTodoを取得する
 */
export class GetTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * 指定されたIDのTodoを取得する
   * @param id TodoのID文字列
   * @returns 見つかった場合はTodoのDTO、見つからない場合はnull
   */
  async execute(id: string): Promise<TodoDto | null> {
    const todoId = new TodoId(id)
    const todo = await this.todoRepository.findById(todoId)
    return todo ? toTodoDto(todo) : null
  }
}
