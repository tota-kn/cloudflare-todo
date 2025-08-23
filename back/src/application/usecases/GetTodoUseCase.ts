import { TodoId } from "../../domain/value-objects/TodoId"
import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

export class GetTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<TodoDto | null> {
    const todoId = new TodoId(id)
    const todo = await this.todoRepository.findById(todoId)
    return todo ? toTodoDto(todo) : null
  }
}
