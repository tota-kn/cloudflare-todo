import { Todo } from '../../domain/entities/Todo'
import { TodoId } from '../../domain/value-objects/TodoId'
import type { ITodoRepository } from '../../infrastructure/repositories/todo/TodoRepository'

export interface CreateTodoRequest {
  title: string
  description?: string
}

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(request: CreateTodoRequest): Promise<Todo> {
    const id = new TodoId(crypto.randomUUID())
    const todo = Todo.create(id, request.title, request.description)

    await this.todoRepository.save(todo)

    return todo
  }
}
