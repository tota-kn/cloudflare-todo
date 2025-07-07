import { CreateTodoUseCase } from '../../application/usecases/CreateTodoUseCase'
import { DeleteFileUseCase } from '../../application/usecases/DeleteFileUseCase'
import { DeleteTodoUseCase } from '../../application/usecases/DeleteTodoUseCase'
import { GetFileUseCase } from '../../application/usecases/GetFileUseCase'
import { GetTodoUseCase } from '../../application/usecases/GetTodoUseCase'
import { ListFilesUseCase } from '../../application/usecases/ListFilesUseCase'
import { ListTodosUseCase } from '../../application/usecases/ListTodosUseCase'
import { UpdateTodoUseCase } from '../../application/usecases/UpdateTodoUseCase'
import { UploadFileUseCase } from '../../application/usecases/UploadFileUseCase'
import { FileRepository } from '../../domain/repositories/FileRepository'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { D1TodoRepository } from '../repositories/D1TodoRepository'
import { R2FileRepository } from '../repositories/R2FileRepository'

export class Dependencies {
  private todoRepository: TodoRepository
  private fileRepository: FileRepository

  private createTodoUseCase: CreateTodoUseCase
  private getTodoUseCase: GetTodoUseCase
  private listTodosUseCase: ListTodosUseCase
  private updateTodoUseCase: UpdateTodoUseCase
  private deleteTodoUseCase: DeleteTodoUseCase

  private listFilesUseCase: ListFilesUseCase
  private getFileUseCase: GetFileUseCase
  private uploadFileUseCase: UploadFileUseCase
  private deleteFileUseCase: DeleteFileUseCase

  constructor(env: CloudflareEnv) {
    // Repositories
    this.todoRepository = new D1TodoRepository(env.DB)
    this.fileRepository = new R2FileRepository(env.STORAGE)

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
}
