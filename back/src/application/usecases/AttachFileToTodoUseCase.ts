import { v4 as uuidv4 } from 'uuid'
import { TodoAttachment } from '../../domain/entities/TodoAttachment'
import { TodoAttachmentRepository } from '../../domain/repositories/TodoAttachmentRepository'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoAttachmentId } from '../../domain/value-objects/TodoAttachmentId'
import { TodoId } from '../../domain/value-objects/TodoId'

export interface AttachFileToTodoRequest {
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
}

export class AttachFileToTodoUseCase {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly todoAttachmentRepository: TodoAttachmentRepository,
  ) {}

  async execute(todoId: string, request: AttachFileToTodoRequest): Promise<TodoAttachment> {
    const todo = await this.todoRepository.findById(new TodoId(todoId))
    if (!todo) {
      throw new Error('Todo not found')
    }

    const attachment = new TodoAttachment(
      new TodoAttachmentId(uuidv4()),
      new TodoId(todoId),
      request.fileKey,
      request.originalFilename,
      request.fileSize,
      request.contentType,
      new Date(),
    )

    await this.todoAttachmentRepository.save(attachment)
    return attachment
  }
}
