import type { ITodoRepository } from '../repositories/ITodoRepository'
import { type TodoResponseDto, toTodoDto } from '../dto/TodoDto'

export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<TodoResponseDto[]> {
    const todos = await this.todoRepository.findAll()
    return todos.map(toTodoDto)
  }
}
