import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<TodoDto[]> {
    const todos = await this.todoRepository.findAll()
    return todos.map(toTodoDto)
  }
}
