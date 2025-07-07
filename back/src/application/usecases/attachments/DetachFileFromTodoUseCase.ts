import { AttachmentRepository } from '../../../domain/repositories/AttachmentRepository'
import { AttachmentId } from '../../../domain/value-objects/AttachmentId'

export class DetachFileFromTodoUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  async execute(attachmentId: string): Promise<void> {
    const attachment = await this.attachmentRepository.findById(new AttachmentId(attachmentId))
    if (!attachment) {
      throw new Error('Attachment not found')
    }

    await this.attachmentRepository.delete(new AttachmentId(attachmentId))
  }
}
