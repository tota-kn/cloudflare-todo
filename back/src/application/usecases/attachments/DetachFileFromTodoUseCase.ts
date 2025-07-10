import { AttachmentId } from '../../../domain/value-objects/AttachmentId'
import type { IAttachmentRepository } from '../../../infrastructure/repositories/attachment/IAttachmentRepository'

export class DetachFileFromTodoUseCase {
  constructor(
    private readonly attachmentRepository: IAttachmentRepository,
  ) {}

  async execute(attachmentId: string): Promise<void> {
    const attachment = await this.attachmentRepository.findById(new AttachmentId(attachmentId))
    if (!attachment) {
      throw new Error('Attachment not found')
    }

    await this.attachmentRepository.delete(new AttachmentId(attachmentId))
  }
}
