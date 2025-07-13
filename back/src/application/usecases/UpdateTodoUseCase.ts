import { TodoId } from '../../domain/value-objects/TodoId'
import type { ITodoRepository } from '../repositories/ITodoRepository'
import { type TodoResponseDto, toTodoDto } from '../dto/TodoDto'

export interface UpdateTodoRequest {
  todoId: string
  title?: string
  description?: string
  completed?: boolean
}

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(request: UpdateTodoRequest): Promise<TodoResponseDto | null> {
    const todoId = new TodoId(request.todoId)
    const todo = await this.todoRepository.findById(todoId)

    if (!todo) {
      return null
    }

    if (request.title !== undefined) {
      todo.updateTitle(request.title)
    }

    if (request.description !== undefined) {
      todo.updateDescription(request.description)
    }

    if (request.completed !== undefined) {
      if (request.completed) {
        todo.complete()
      }
      else {
        todo.markAsPending()
      }
    }

    await this.todoRepository.update(todo)

    return toTodoDto(todo)
  }
}
