import { Attachment } from '../../../domain/entities/Attachment'
import { AttachmentId } from '../../../domain/value-objects/AttachmentId'
import { TodoId } from '../../../domain/value-objects/TodoId'

export interface IAttachmentRepository {
  save(attachment: Attachment): Promise<void>
  findById(id: AttachmentId): Promise<Attachment | null>
  findByTodoId(todoId: TodoId): Promise<Attachment[]>
  delete(id: AttachmentId): Promise<void>
  deleteByTodoId(todoId: TodoId): Promise<void>
}
