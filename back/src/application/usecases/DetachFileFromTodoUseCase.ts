import { TodoAttachmentRepository } from '../../domain/repositories/TodoAttachmentRepository'
import { TodoAttachmentId } from '../../domain/value-objects/TodoAttachmentId'

export class DetachFileFromTodoUseCase {
  constructor(
    private readonly todoAttachmentRepository: TodoAttachmentRepository,
  ) {}

  async execute(attachmentId: string): Promise<void> {
    const attachment = await this.todoAttachmentRepository.findById(new TodoAttachmentId(attachmentId))
    if (!attachment) {
      throw new Error('Attachment not found')
    }

    await this.todoAttachmentRepository.delete(new TodoAttachmentId(attachmentId))
  }
}
