import { Todo } from '../../../domain/entities/Todo'
import { TodoRepository } from '../../../domain/repositories/TodoRepository'

export class ListTodosUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<Todo[]> {
    return await this.todoRepository.findAll()
  }
}
