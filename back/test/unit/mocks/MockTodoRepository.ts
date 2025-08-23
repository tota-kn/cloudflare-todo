import { ITodoRepository } from "../../../src/application/repositories/ITodoRepository"
import { Todo } from "../../../src/domain/entities/Todo"
import { TodoId } from "../../../src/domain/value-objects/TodoId"

export class MockTodoRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map()

  async save(todo: Todo): Promise<void> {
    this.todos.set(todo.getId().getValue(), todo)
  }

  async findById(id: TodoId): Promise<Todo | null> {
    return this.todos.get(id.getValue()) || null
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values())
  }

  async update(todo: Todo): Promise<void> {
    this.todos.set(todo.getId().getValue(), todo)
  }

  async delete(id: TodoId): Promise<void> {
    this.todos.delete(id.getValue())
  }

  // テストヘルパーメソッド
  clear(): void {
    this.todos.clear()
  }

  has(id: TodoId): boolean {
    return this.todos.has(id.getValue())
  }

  size(): number {
    return this.todos.size
  }
}
