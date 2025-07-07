import { Todo } from '../../domain/entities/Todo'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoId } from '../../domain/value-objects/TodoId'

export class GetTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<Todo | null> {
    const todoId = new TodoId(id)
    return await this.todoRepository.findById(todoId)
  }
}
