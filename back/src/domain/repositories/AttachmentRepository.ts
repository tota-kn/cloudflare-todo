import { Attachment } from '../entities/Attachment'
import { AttachmentId } from '../value-objects/AttachmentId'
import { TodoId } from '../value-objects/TodoId'

export interface AttachmentRepository {
  save(attachment: Attachment): Promise<void>
  findById(id: AttachmentId): Promise<Attachment | null>
  findByTodoId(todoId: TodoId): Promise<Attachment[]>
  delete(id: AttachmentId): Promise<void>
  deleteByTodoId(todoId: TodoId): Promise<void>
}
