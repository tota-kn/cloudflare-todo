import { v4 as uuidv4 } from 'uuid'
import { Attachment } from '../../domain/entities/Attachment'
import { AttachmentId } from '../../domain/value-objects/AttachmentId'
import { TodoId } from '../../domain/value-objects/TodoId'
import type { IAttachmentRepository } from '../repositories/IAttachmentRepository'
import type { ITodoRepository } from '../repositories/ITodoRepository'

export interface AttachFileToTodoRequest {
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
}

export class AttachFileToTodoUseCase {
  constructor(
    private readonly todoRepository: ITodoRepository,
    private readonly attachmentRepository: IAttachmentRepository,
  ) {}

  async execute(todoId: string, request: AttachFileToTodoRequest): Promise<Attachment> {
    const todo = await this.todoRepository.findById(new TodoId(todoId))
    if (!todo) {
      throw new Error('Todo not found')
    }

    const attachment = new Attachment(
      new AttachmentId(uuidv4()),
      new TodoId(todoId),
      request.fileKey,
      request.originalFilename,
      request.fileSize,
      request.contentType,
      new Date(),
    )

    await this.attachmentRepository.save(attachment)
    return attachment
  }
}
