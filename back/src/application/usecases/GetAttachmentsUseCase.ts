import { TodoId } from '../../domain/value-objects/TodoId'
import { type AttachmentDto, toAttachmentDto } from '../dto/AttachmentDto'
import type { IAttachmentRepository } from '../repositories/IAttachmentRepository'

export class GetAttachmentsUseCase {
  constructor(
    private readonly attachmentRepository: IAttachmentRepository,
  ) {}

  async execute(todoId: string): Promise<AttachmentDto[]> {
    const attachments = await this.attachmentRepository.findByTodoId(new TodoId(todoId))
    return attachments.map(toAttachmentDto)
  }
}
