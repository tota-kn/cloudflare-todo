import { CreateTodoUseCase } from '../../application/usecases/CreateTodoUseCase'
import { DeleteFileUseCase } from '../../application/usecases/DeleteFileUseCase'
import { DeleteTodoUseCase } from '../../application/usecases/DeleteTodoUseCase'
import { GetFileUseCase } from '../../application/usecases/GetFileUseCase'
import { GetTodoUseCase } from '../../application/usecases/GetTodoUseCase'
import { ListFilesUseCase } from '../../application/usecases/ListFilesUseCase'
import { ListTodosUseCase } from '../../application/usecases/ListTodosUseCase'
import { UpdateTodoUseCase } from '../../application/usecases/UpdateTodoUseCase'
import { UploadFileUseCase } from '../../application/usecases/UploadFileUseCase'
import { AttachFileToTodoUseCase } from '../../application/usecases/AttachFileToTodoUseCase'
import { GetTodoAttachmentsUseCase } from '../../application/usecases/GetTodoAttachmentsUseCase'
import { DetachFileFromTodoUseCase } from '../../application/usecases/DetachFileFromTodoUseCase'
import { FileRepository } from '../../domain/repositories/FileRepository'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoAttachmentRepository } from '../../domain/repositories/TodoAttachmentRepository'
import { D1TodoRepository } from '../repositories/D1TodoRepository'
import { R2FileRepository } from '../repositories/R2FileRepository'
import { D1TodoAttachmentRepository } from '../repositories/D1TodoAttachmentRepository'

export class Dependencies {
  private todoRepository: TodoRepository
  private fileRepository: FileRepository
  private todoAttachmentRepository: TodoAttachmentRepository

  private createTodoUseCase: CreateTodoUseCase
  private getTodoUseCase: GetTodoUseCase
  private listTodosUseCase: ListTodosUseCase
  private updateTodoUseCase: UpdateTodoUseCase
  private deleteTodoUseCase: DeleteTodoUseCase

  private listFilesUseCase: ListFilesUseCase
  private getFileUseCase: GetFileUseCase
  private uploadFileUseCase: UploadFileUseCase
  private deleteFileUseCase: DeleteFileUseCase

  private attachFileToTodoUseCase: AttachFileToTodoUseCase
  private getTodoAttachmentsUseCase: GetTodoAttachmentsUseCase
  private detachFileFromTodoUseCase: DetachFileFromTodoUseCase

  constructor(env: CloudflareEnv) {
    // Repositories
    this.todoRepository = new D1TodoRepository(env.DB)
    this.fileRepository = new R2FileRepository(env.STORAGE)
    this.todoAttachmentRepository = new D1TodoAttachmentRepository(env.DB)

    // Todo Use Cases
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository)
    this.getTodoUseCase = new GetTodoUseCase(this.todoRepository)
    this.listTodosUseCase = new ListTodosUseCase(this.todoRepository)
    this.updateTodoUseCase = new UpdateTodoUseCase(this.todoRepository)
    this.deleteTodoUseCase = new DeleteTodoUseCase(this.todoRepository)

    // File Use Cases
    this.listFilesUseCase = new ListFilesUseCase(this.fileRepository)
    this.getFileUseCase = new GetFileUseCase(this.fileRepository)
    this.uploadFileUseCase = new UploadFileUseCase(this.fileRepository)
    this.deleteFileUseCase = new DeleteFileUseCase(this.fileRepository)

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

  // File Use Cases
  getListFilesUseCase(): ListFilesUseCase {
    return this.listFilesUseCase
  }

  getGetFileUseCase(): GetFileUseCase {
    return this.getFileUseCase
  }

  getUploadFileUseCase(): UploadFileUseCase {
    return this.uploadFileUseCase
  }

  getDeleteFileUseCase(): DeleteFileUseCase {
    return this.deleteFileUseCase
  }

  // Repositories
  getTodoRepository(): TodoRepository {
    return this.todoRepository
  }

  getFileRepository(): FileRepository {
    return this.fileRepository
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
