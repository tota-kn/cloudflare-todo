import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

/**
 * Todo一覧取得ユースケース
 * 全てのTodoを取得し、DTOとして返す
 */
export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * 指定ユーザーの全Todoを取得する
   * @param userId ユーザーID
   * @returns TodoのDTO配列
   */
  async execute(userId: string): Promise<TodoDto[]> {
    const todos = await this.todoRepository.findAll(userId)
    return todos.map(toTodoDto)
  }
}
