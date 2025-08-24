import { Todo } from "../../domain/entities/Todo"
import { TodoId } from "../../domain/value-objects/TodoId"
import { type TodoDto, toTodoDto } from "../dto/TodoDto"
import type { ITodoRepository } from "../repositories/ITodoRepository"

/**
 * Todo作成リクエスト
 */
export interface CreateTodoRequest {
  title: string
  description?: string
}

/**
 * Todo作成ユースケース
 * 新しいTodoを作成し、リポジトリに保存する
 */
export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * 新しいTodoを作成する
   * @param request Todo作成リクエスト
   * @returns 作成されたTodoのDTO
   */
  async execute(request: CreateTodoRequest): Promise<TodoDto> {
    const id = new TodoId(crypto.randomUUID())
    const todo = Todo.create(id, request.title, request.description)

    await this.todoRepository.save(todo)

    return toTodoDto(todo)
  }
}
