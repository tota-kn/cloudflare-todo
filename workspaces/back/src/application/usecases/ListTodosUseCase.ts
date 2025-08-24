import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

/**
 * Todo一覧取得ユースケース
 * 全てのTodoを取得し、DTOとして返す
 */
export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * 全てのTodoを取得する
   * @returns TodoのDTO配列
   */
  async execute(): Promise<TodoDto[]> {
    const todos = await this.todoRepository.findAll()
    return todos.map(toTodoDto)
  }
}
