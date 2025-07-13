import { Todo } from '../../domain/entities/Todo'
import type { ITodoRepository } from '../repositories/ITodoRepository'

export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<Todo[]> {
    return await this.todoRepository.findAll()
  }
}
