import { Todo } from "../../../src/domain/entities/Todo"
import { TodoId } from "../../../src/domain/value-objects/TodoId"
import { TodoStatus } from "../../../src/domain/value-objects/TodoStatus"

export class TestFactory {
  static readonly DEFAULT_USER_ID = "test-user-001"

  static createTodoId(value?: string): TodoId {
    return new TodoId(value || crypto.randomUUID())
  }

  static createTodo(overrides?: {
    id?: TodoId
    userId?: string
    title?: string
    description?: string
    status?: TodoStatus
    createdAt?: Date
    updatedAt?: Date
  }): Todo {
    const id = overrides?.id || TestFactory.createTodoId()
    const userId = overrides?.userId || TestFactory.DEFAULT_USER_ID
    const title = overrides?.title || "テストタスク"
    const description = overrides?.description

    return Todo.create(id, userId, title, description)
  }

  static createPendingTodo(
    title: string = "未完了タスク",
    description?: string,
    userId?: string
  ): Todo {
    const todo = TestFactory.createTodo({ title, description, userId })
    return todo
  }

  static createCompletedTodo(
    title: string = "完了タスク",
    description?: string,
    userId?: string
  ): Todo {
    const todo = TestFactory.createTodo({ title, description, userId })
    todo.complete()
    return todo
  }

  static createTodoFromData(data: {
    id: string
    userId?: string
    title: string
    description?: string
    completed?: boolean
    createdAt?: Date
    updatedAt?: Date
  }): Todo {
    const dbData = {
      id: data.id,
      user_id: data.userId || TestFactory.DEFAULT_USER_ID,
      title: data.title,
      description: data.description || "",
      completed: data.completed ? 1 : 0,
      created_at: (data.createdAt || new Date()).toISOString(),
      updated_at: (data.updatedAt || new Date()).toISOString(),
    }
    return Todo.fromData(dbData)
  }
}
