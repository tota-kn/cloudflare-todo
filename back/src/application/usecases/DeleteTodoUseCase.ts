import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoId } from '../../domain/value-objects/TodoId'

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

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
