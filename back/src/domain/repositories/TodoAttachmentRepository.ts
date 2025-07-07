import { TodoAttachment } from '../entities/TodoAttachment'
import { TodoAttachmentId } from '../value-objects/TodoAttachmentId'
import { TodoId } from '../value-objects/TodoId'

export interface TodoAttachmentRepository {
  save(attachment: TodoAttachment): Promise<void>
  findById(id: TodoAttachmentId): Promise<TodoAttachment | null>
  findByTodoId(todoId: TodoId): Promise<TodoAttachment[]>
  delete(id: TodoAttachmentId): Promise<void>
  deleteByTodoId(todoId: TodoId): Promise<void>
}
