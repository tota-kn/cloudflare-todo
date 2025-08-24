import type { ITodoRepository } from "./application/repositories/ITodoRepository"
import { CreateTodoUseCase } from "./application/usecases/CreateTodoUseCase"
import { DeleteTodoUseCase } from "./application/usecases/DeleteTodoUseCase"
import { GetTodoUseCase } from "./application/usecases/GetTodoUseCase"
import { ListTodosUseCase } from "./application/usecases/ListTodosUseCase"
import { UpdateTodoUseCase } from "./application/usecases/UpdateTodoUseCase"
import { D1TodoRepository } from "./infrastructure/repositories/D1TodoRepository"

/**
 * アプリケーションの依存関係を管理するDIコンテナ
 * CloudflareのWorker環境で必要な依存関係を初期化し、各ユースケースへの参照を提供する
 */
export class Dependencies {
  private todoRepository: ITodoRepository
  private BucketRepository: R2Bucket
  private createTodoUseCase: CreateTodoUseCase
  private getTodoUseCase: GetTodoUseCase
  private listTodosUseCase: ListTodosUseCase
  private updateTodoUseCase: UpdateTodoUseCase
  private deleteTodoUseCase: DeleteTodoUseCase

  /**
   * Cloudflare環境から必要な依存関係を初期化する
   * @param env Cloudflareの環境変数（データベース、ストレージ等）
   */
  constructor(env: CloudflareEnv) {
    this.todoRepository = new D1TodoRepository(env.DB)
    this.BucketRepository = env.STORAGE
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository)
    this.getTodoUseCase = new GetTodoUseCase(this.todoRepository)
    this.listTodosUseCase = new ListTodosUseCase(this.todoRepository)
    this.updateTodoUseCase = new UpdateTodoUseCase(this.todoRepository)
    this.deleteTodoUseCase = new DeleteTodoUseCase(this.todoRepository)
  }

  /**
   * Todo作成ユースケースのインスタンスを取得する
   * @returns CreateTodoUseCaseのインスタンス
   */
  getCreateTodoUseCase(): CreateTodoUseCase {
    return this.createTodoUseCase
  }

  /**
   * Todo取得ユースケースのインスタンスを取得する
   * @returns GetTodoUseCaseのインスタンス
   */
  getGetTodoUseCase(): GetTodoUseCase {
    return this.getTodoUseCase
  }

  /**
   * Todo一覧取得ユースケースのインスタンスを取得する
   * @returns ListTodosUseCaseのインスタンス
   */
  getListTodosUseCase(): ListTodosUseCase {
    return this.listTodosUseCase
  }

  /**
   * Todo更新ユースケースのインスタンスを取得する
   * @returns UpdateTodoUseCaseのインスタンス
   */
  getUpdateTodoUseCase(): UpdateTodoUseCase {
    return this.updateTodoUseCase
  }

  /**
   * Todo削除ユースケースのインスタンスを取得する
   * @returns DeleteTodoUseCaseのインスタンス
   */
  getDeleteTodoUseCase(): DeleteTodoUseCase {
    return this.deleteTodoUseCase
  }

  /**
   * Todoリポジトリのインスタンスを取得する
   * @returns ITodoRepositoryの実装インスタンス
   */
  getTodoRepository(): ITodoRepository {
    return this.todoRepository
  }

  /**
   * R2バケットのインスタンスを取得する
   * @returns CloudflareのR2Bucketインスタンス
   */
  getBucketRepository(): R2Bucket {
    return this.BucketRepository
  }
}
