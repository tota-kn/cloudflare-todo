import { Todo } from '../../../domain/entities/Todo'
import { TodoRepository } from '../../../domain/repositories/TodoRepository'
import { TodoId } from '../../../domain/value-objects/TodoId'

export interface UpdateTodoRequest {
  id: string
  title?: string
  description?: string
  completed?: boolean
}

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(request: UpdateTodoRequest): Promise<Todo | null> {
    const todoId = new TodoId(request.id)
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

    return todo
  }
}
