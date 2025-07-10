import { Todo } from '../../../domain/entities/Todo'
import { TodoId } from '../../../domain/value-objects/TodoId'

export interface ITodoRepository {
  save(todo: Todo): Promise<void>
  findById(id: TodoId): Promise<Todo | null>
  findAll(): Promise<Todo[]>
  update(todo: Todo): Promise<void>
  delete(id: TodoId): Promise<void>
}
