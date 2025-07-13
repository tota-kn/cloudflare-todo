import { Attachment } from '../../domain/entities/Attachment'
import { TodoId } from '../../domain/value-objects/TodoId'
import type { IAttachmentRepository } from '../repositories/IAttachmentRepository'

export class GetAttachmentsUseCase {
  constructor(
    private readonly attachmentRepository: IAttachmentRepository,
  ) {}

  async execute(todoId: string): Promise<Attachment[]> {
    return await this.attachmentRepository.findByTodoId(new TodoId(todoId))
  }
}
