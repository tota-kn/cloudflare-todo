import { CreateTodoUseCase } from '../../application/usecases/CreateTodoUseCase'
import { DeleteTodoUseCase } from '../../application/usecases/DeleteTodoUseCase'
import { GetTodoUseCase } from '../../application/usecases/GetTodoUseCase'
import { ListTodosUseCase } from '../../application/usecases/ListTodosUseCase'
import { UpdateTodoUseCase } from '../../application/usecases/UpdateTodoUseCase'
import { AttachFileToTodoUseCase } from '../../application/usecases/AttachFileToTodoUseCase'
import { GetTodoAttachmentsUseCase } from '../../application/usecases/GetTodoAttachmentsUseCase'
import { DetachFileFromTodoUseCase } from '../../application/usecases/DetachFileFromTodoUseCase'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoAttachmentRepository } from '../../domain/repositories/TodoAttachmentRepository'
import { D1TodoRepository } from '../repositories/D1TodoRepository'
import { D1TodoAttachmentRepository } from '../repositories/D1TodoAttachmentRepository'

export class Dependencies {
  private todoRepository: TodoRepository
  private todoAttachmentRepository: TodoAttachmentRepository

  private createTodoUseCase: CreateTodoUseCase
  private getTodoUseCase: GetTodoUseCase
  private listTodosUseCase: ListTodosUseCase
  private updateTodoUseCase: UpdateTodoUseCase
  private deleteTodoUseCase: DeleteTodoUseCase

  private attachFileToTodoUseCase: AttachFileToTodoUseCase
  private getTodoAttachmentsUseCase: GetTodoAttachmentsUseCase
  private detachFileFromTodoUseCase: DetachFileFromTodoUseCase

  constructor(env: CloudflareEnv) {
    // Repositories
    this.todoRepository = new D1TodoRepository(env.DB)
    this.todoAttachmentRepository = new D1TodoAttachmentRepository(env.DB)

    // Todo Use Cases
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository)
    this.getTodoUseCase = new GetTodoUseCase(this.todoRepository)
    this.listTodosUseCase = new ListTodosUseCase(this.todoRepository)
    this.updateTodoUseCase = new UpdateTodoUseCase(this.todoRepository)
    this.deleteTodoUseCase = new DeleteTodoUseCase(this.todoRepository)

    // Todo Attachment Use Cases
    this.attachFileToTodoUseCase = new AttachFileToTodoUseCase(
      this.todoRepository,
      this.todoAttachmentRepository,
    )
    this.getTodoAttachmentsUseCase = new GetTodoAttachmentsUseCase(
      this.todoAttachmentRepository,
    )
    this.detachFileFromTodoUseCase = new DetachFileFromTodoUseCase(
      this.todoAttachmentRepository,
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

  getTodoAttachmentRepository(): TodoAttachmentRepository {
    return this.todoAttachmentRepository
  }

  // Todo Attachment Use Cases
  getAttachFileToTodoUseCase(): AttachFileToTodoUseCase {
    return this.attachFileToTodoUseCase
  }

  getGetTodoAttachmentsUseCase(): GetTodoAttachmentsUseCase {
    return this.getTodoAttachmentsUseCase
  }

  getDetachFileFromTodoUseCase(): DetachFileFromTodoUseCase {
    return this.detachFileFromTodoUseCase
  }
}
