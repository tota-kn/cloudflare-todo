import { Todo } from '../../domain/entities/Todo'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoId } from '../../domain/value-objects/TodoId'

export interface CreateTodoRequest {
  title: string
  description?: string
}

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(request: CreateTodoRequest): Promise<Todo> {
    const id = new TodoId(crypto.randomUUID())
    const todo = Todo.create(id, request.title, request.description)

    await this.todoRepository.save(todo)

    return todo
  }
}
