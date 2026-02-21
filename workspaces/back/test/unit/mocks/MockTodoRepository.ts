import { ITodoRepository } from "../../../src/application/repositories/ITodoRepository"
import { Todo } from "../../../src/domain/entities/Todo"
import { TodoId } from "../../../src/domain/value-objects/TodoId"

export class MockTodoRepository implements ITodoRepository {
  private todos: Map<string, Todo> = new Map()

  async save(todo: Todo): Promise<void> {
    this.todos.set(todo.getId().getValue(), todo)
  }

  async findById(id: TodoId, userId: string): Promise<Todo | null> {
    const todo = this.todos.get(id.getValue()) || null
    if (todo && todo.getUserId() !== userId) {
      return null
    }
    return todo
  }

  async findAll(userId: string): Promise<Todo[]> {
    return Array.from(this.todos.values()).filter(
      (todo) => todo.getUserId() === userId
    )
  }

  async update(todo: Todo): Promise<void> {
    this.todos.set(todo.getId().getValue(), todo)
  }

  async delete(id: TodoId, userId: string): Promise<void> {
    const todo = this.todos.get(id.getValue())
    if (todo && todo.getUserId() === userId) {
      this.todos.delete(id.getValue())
    }
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
