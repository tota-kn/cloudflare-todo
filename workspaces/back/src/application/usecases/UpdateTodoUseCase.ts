import { TodoId } from "../../domain/value-objects/TodoId"
import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

/**
 * Todo更新リクエスト
 */
export interface UpdateTodoRequest {
  /** オーナーユーザーID */
  userId: string
  /** 更新対象のTodoのID */
  todoId: string
  /** 新しいタイトル（オプション） */
  title?: string
  /** 新しい説明（オプション） */
  description?: string
  /** 完了状態（オプション） */
  completed?: boolean
}

/**
 * Todo更新ユースケース
 * 指定されたTodoの情報を更新する
 */
export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * Todoを更新する
   * @param request Todo更新リクエスト
   * @returns 更新されたTodoのDTO、見つからない場合はnull
   */
  async execute(request: UpdateTodoRequest): Promise<TodoDto | null> {
    const todoId = new TodoId(request.todoId)
    const todo = await this.todoRepository.findById(todoId, request.userId)

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
      } else {
        todo.markAsPending()
      }
    }

    await this.todoRepository.update(todo)

    return toTodoDto(todo)
  }
}
