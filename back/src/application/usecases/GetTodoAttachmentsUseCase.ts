import { TodoAttachment } from '../../domain/entities/TodoAttachment'
import { TodoAttachmentRepository } from '../../domain/repositories/TodoAttachmentRepository'
import { TodoId } from '../../domain/value-objects/TodoId'

export class GetTodoAttachmentsUseCase {
  constructor(
    private readonly todoAttachmentRepository: TodoAttachmentRepository,
  ) {}

  async execute(todoId: string): Promise<TodoAttachment[]> {
    return await this.todoAttachmentRepository.findByTodoId(new TodoId(todoId))
  }
}
