import { Todo } from '../../../domain/entities/Todo'
import { TodoId } from '../../../domain/value-objects/TodoId'
import type { ITodoRepository } from '../../../infrastructure/repositories/todo/TodoRepository'

export class GetTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<Todo | null> {
    const todoId = new TodoId(id)
    return await this.todoRepository.findById(todoId)
  }
}
