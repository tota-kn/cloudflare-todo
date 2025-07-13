import type { ITodoRepository } from './application/repositories/ITodoRepository'
import { CreateTodoUseCase } from './application/usecases/CreateTodoUseCase'
import { DeleteTodoUseCase } from './application/usecases/DeleteTodoUseCase'
import { GetTodoUseCase } from './application/usecases/GetTodoUseCase'
import { ListTodosUseCase } from './application/usecases/ListTodosUseCase'
import { UpdateTodoUseCase } from './application/usecases/UpdateTodoUseCase'
import { D1TodoRepository } from './infrastructure/repositories/D1TodoRepository'

export class Dependencies {
  private todoRepository: ITodoRepository
  private createTodoUseCase: CreateTodoUseCase
  private getTodoUseCase: GetTodoUseCase
  private listTodosUseCase: ListTodosUseCase
  private updateTodoUseCase: UpdateTodoUseCase
  private deleteTodoUseCase: DeleteTodoUseCase

  constructor(env: CloudflareEnv) {
    this.todoRepository = new D1TodoRepository(env.DB)
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository)
    this.getTodoUseCase = new GetTodoUseCase(this.todoRepository)
    this.listTodosUseCase = new ListTodosUseCase(this.todoRepository)
    this.updateTodoUseCase = new UpdateTodoUseCase(this.todoRepository)
    this.deleteTodoUseCase = new DeleteTodoUseCase(this.todoRepository)
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
}
