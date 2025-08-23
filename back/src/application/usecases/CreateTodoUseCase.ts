import { Todo } from "../../domain/entities/Todo"
import { TodoId } from "../../domain/value-objects/TodoId"
import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

export interface CreateTodoRequest {
  title: string
  description?: string
}

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(request: CreateTodoRequest): Promise<TodoDto> {
    const id = new TodoId(crypto.randomUUID())
    const todo = Todo.create(id, request.title, request.description)

    await this.todoRepository.save(todo)

    return toTodoDto(todo)
  }
}
