import { CreateTodoUseCase } from '../../application/usecases/CreateTodoUseCase'
import { DeleteTodoUseCase } from '../../application/usecases/DeleteTodoUseCase'
import { GetTodoUseCase } from '../../application/usecases/GetTodoUseCase'
import { ListTodosUseCase } from '../../application/usecases/ListTodosUseCase'
import { UpdateTodoUseCase } from '../../application/usecases/UpdateTodoUseCase'
import { DeleteFileUseCase } from '../../application/usecases/DeleteFileUseCase'
import { GetFileUseCase } from '../../application/usecases/GetFileUseCase'
import { ListFilesUseCase } from '../../application/usecases/ListFilesUseCase'
import { UploadFileUseCase } from '../../application/usecases/UploadFileUseCase'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { FileRepository } from '../../domain/repositories/FileRepository'
import { TodoController } from '../../presentation/controllers/TodoController'
import { FileController } from '../../presentation/controllers/FileController'
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

  private todoController: TodoController
  private fileController: FileController

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

    // Controllers
    this.todoController = new TodoController(
      this.createTodoUseCase,
      this.getTodoUseCase,
      this.listTodosUseCase,
      this.updateTodoUseCase,
      this.deleteTodoUseCase,
    )

    this.fileController = new FileController(
      this.listFilesUseCase,
      this.getFileUseCase,
      this.uploadFileUseCase,
      this.deleteFileUseCase,
    )
  }

  getTodoController(): TodoController {
    return this.todoController
  }

  getFileController(): FileController {
    return this.fileController
  }
}
