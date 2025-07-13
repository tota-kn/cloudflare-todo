import { TodoId } from '../../domain/value-objects/TodoId'
import type { ITodoRepository } from '../repositories/ITodoRepository'
import { type TodoResponseDto, toTodoDto } from '../dto/TodoDto'

export class GetTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<TodoResponseDto | null> {
    const todoId = new TodoId(id)
    const todo = await this.todoRepository.findById(todoId)
    return todo ? toTodoDto(todo) : null
  }
}
