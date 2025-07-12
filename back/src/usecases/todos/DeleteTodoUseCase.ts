import { TodoId } from '../../domain/value-objects/TodoId'
import type { ITodoRepository } from '../../infrastructure/repositories/todo/TodoRepository'

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<boolean> {
    const todoId = new TodoId(id)
    const todo = await this.todoRepository.findById(todoId)

    if (!todo) {
      return false
    }

    await this.todoRepository.delete(todoId)

    return true
  }
}
