import { Todo } from '../entities/Todo'
import { TodoId } from '../value-objects/TodoId'

export interface TodoRepository {
  save(todo: Todo): Promise<void>
  findById(id: TodoId): Promise<Todo | null>
  findAll(): Promise<Todo[]>
  update(todo: Todo): Promise<void>
  delete(id: TodoId): Promise<void>
}
