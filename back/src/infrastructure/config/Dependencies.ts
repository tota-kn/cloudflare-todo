import { AttachFileToTodoUseCase } from '../../application/usecases/attachments/AttachFileToTodoUseCase'
import { DetachFileFromTodoUseCase } from '../../application/usecases/attachments/DetachFileFromTodoUseCase'
import { GetAttachmentsUseCase } from '../../application/usecases/attachments/GetAttachmentsUseCase'
import { CreateTodoUseCase } from '../../application/usecases/todos/CreateTodoUseCase'
import { DeleteTodoUseCase } from '../../application/usecases/todos/DeleteTodoUseCase'
import { GetTodoUseCase } from '../../application/usecases/todos/GetTodoUseCase'
import { ListTodosUseCase } from '../../application/usecases/todos/ListTodosUseCase'
import { UpdateTodoUseCase } from '../../application/usecases/todos/UpdateTodoUseCase'
import type { AttachmentRepository } from '../../domain/repositories/AttachmentRepository'
import type { TodoRepository } from '../../domain/repositories/TodoRepository'
import { D1AttachmentRepository } from '../repositories/D1AttachmentRepository'
import { D1TodoRepository } from '../repositories/D1TodoRepository'

export class Dependencies {
  private todoRepository: TodoRepository
  private attachmentRepository: AttachmentRepository

  private createTodoUseCase: CreateTodoUseCase
  private getTodoUseCase: GetTodoUseCase
  private listTodosUseCase: ListTodosUseCase
  private updateTodoUseCase: UpdateTodoUseCase
  private deleteTodoUseCase: DeleteTodoUseCase

  private attachFileToTodoUseCase: AttachFileToTodoUseCase
  private getAttachmentsUseCase: GetAttachmentsUseCase
  private detachFileFromTodoUseCase: DetachFileFromTodoUseCase

  constructor(env: CloudflareEnv) {
    // Repositories
    this.todoRepository = new D1TodoRepository(env.DB)
    this.attachmentRepository = new D1AttachmentRepository(env.DB)

    // Todo Use Cases
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository)
    this.getTodoUseCase = new GetTodoUseCase(this.todoRepository)
    this.listTodosUseCase = new ListTodosUseCase(this.todoRepository)
    this.updateTodoUseCase = new UpdateTodoUseCase(this.todoRepository)
    this.deleteTodoUseCase = new DeleteTodoUseCase(this.todoRepository)

    // Attachment Use Cases
    this.attachFileToTodoUseCase = new AttachFileToTodoUseCase(
      this.todoRepository,
      this.attachmentRepository,
    )
    this.getAttachmentsUseCase = new GetAttachmentsUseCase(
      this.attachmentRepository,
    )
    this.detachFileFromTodoUseCase = new DetachFileFromTodoUseCase(
      this.attachmentRepository,
    )
  }

  // Todo Use Cases
  getCreateTodoUseCase(): CreateTodoUseCase {
    return this.createTodoUseCase
  }

  getGetTodoUseCase(): GetTodoUseCase {
    return this.getTodoUseCase
  }

  getListTodosUseCase(): ListTodosUseCase {
    return this.listTodosUseCase
  }

  getUpdateTodoUseCase(): UpdateTodoUseCase {
    return this.updateTodoUseCase
  }

  getDeleteTodoUseCase(): DeleteTodoUseCase {
    return this.deleteTodoUseCase
  }

  // Repositories
  getTodoRepository(): TodoRepository {
    return this.todoRepository
  }

  getAttachmentRepository(): AttachmentRepository {
    return this.attachmentRepository
  }

  // Attachment Use Cases
  getAttachFileToTodoUseCase(): AttachFileToTodoUseCase {
    return this.attachFileToTodoUseCase
  }

  getGetAttachmentsUseCase(): GetAttachmentsUseCase {
    return this.getAttachmentsUseCase
  }

  getDetachFileFromTodoUseCase(): DetachFileFromTodoUseCase {
    return this.detachFileFromTodoUseCase
  }
}
