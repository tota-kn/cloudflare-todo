import type { IAttachmentRepository } from './application/repositories/IAttachmentRepository'
import type { ITodoRepository } from './application/repositories/ITodoRepository'
import { AttachFileToTodoUseCase } from './application/usecases/AttachFileToTodoUseCase'
import { CreateTodoUseCase } from './application/usecases/CreateTodoUseCase'
import { DeleteTodoUseCase } from './application/usecases/DeleteTodoUseCase'
import { DetachFileFromTodoUseCase } from './application/usecases/DetachFileFromTodoUseCase'
import { GetAttachmentsUseCase } from './application/usecases/GetAttachmentsUseCase'
import { GetTodoUseCase } from './application/usecases/GetTodoUseCase'
import { ListTodosUseCase } from './application/usecases/ListTodosUseCase'
import { UpdateTodoUseCase } from './application/usecases/UpdateTodoUseCase'
import { D1AttachmentRepository } from './infrastructure/repositories/D1AttachmentRepository'
import { D1TodoRepository } from './infrastructure/repositories/D1TodoRepository'

export class Dependencies {
  private todoRepository: ITodoRepository
  private attachmentRepository: IAttachmentRepository
  private createTodoUseCase: CreateTodoUseCase
  private getTodoUseCase: GetTodoUseCase
  private listTodosUseCase: ListTodosUseCase
  private updateTodoUseCase: UpdateTodoUseCase
  private deleteTodoUseCase: DeleteTodoUseCase
  private attachFileToTodoUseCase: AttachFileToTodoUseCase
  private getAttachmentsUseCase: GetAttachmentsUseCase
  private detachFileFromTodoUseCase: DetachFileFromTodoUseCase

  constructor(env: CloudflareEnv) {
    this.todoRepository = new D1TodoRepository(env.DB)
    this.attachmentRepository = new D1AttachmentRepository(env.DB)
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository)
    this.getTodoUseCase = new GetTodoUseCase(this.todoRepository)
    this.listTodosUseCase = new ListTodosUseCase(this.todoRepository)
    this.updateTodoUseCase = new UpdateTodoUseCase(this.todoRepository)
    this.deleteTodoUseCase = new DeleteTodoUseCase(this.todoRepository)
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

  getTodoRepository(): ITodoRepository {
    return this.todoRepository
  }

  getAttachmentRepository(): IAttachmentRepository {
    return this.attachmentRepository
  }

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
