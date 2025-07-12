import { Todo } from '../../domain/entities/Todo'
import type { ITodoRepository } from '../../infrastructure/repositories/todo/TodoRepository'

export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<Todo[]> {
    return await this.todoRepository.findAll()
  }
}
