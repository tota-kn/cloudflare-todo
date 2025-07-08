import { Attachment } from '../../../domain/entities/Attachment'
import type { AttachmentRepository } from '../../../domain/repositories/AttachmentRepository'
import { TodoId } from '../../../domain/value-objects/TodoId'

export class GetAttachmentsUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  async execute(todoId: string): Promise<Attachment[]> {
    return await this.attachmentRepository.findByTodoId(new TodoId(todoId))
  }
}
