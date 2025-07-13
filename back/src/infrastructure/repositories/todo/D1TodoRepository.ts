import { desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Todo } from '../../../domain/entities/Todo'
import { TodoId } from '../../../domain/value-objects/TodoId'
import type { ITodoRepository } from '../../../usecases/repositories/ITodoRepository'
import { todosTable } from '../../database/schema'

export class D1TodoRepository implements ITodoRepository {
  private readonly drizzle

  constructor(db: D1Database) {
    this.drizzle = drizzle(db)
  }

  async save(todo: Todo): Promise<void> {
    await this.drizzle.insert(todosTable).values({
      id: todo.getId().toString(),
      title: todo.getTitle(),
      description: todo.getDescription(),
      completed: todo.getStatus().toBoolean(),
      createdAt: todo.getCreatedAt().toISOString(),
      updatedAt: todo.getUpdatedAt().toISOString(),
    })
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const result = await this.drizzle
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id.toString()))
      .get()

    if (!result) {
      return null
    }

    return Todo.fromData({
      id: result.id,
      title: result.title,
      description: result.description,
      completed: result.completed ? 1 : 0,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
    })
  }

  async findAll(): Promise<Todo[]> {
    const results = await this.drizzle
      .select()
      .from(todosTable)
      .orderBy(desc(todosTable.createdAt))
      .all()

    return results.map(result => Todo.fromData({
      id: result.id,
      title: result.title,
      description: result.description,
      completed: result.completed ? 1 : 0,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
    }))
  }

  async update(todo: Todo): Promise<void> {
    await this.drizzle
      .update(todosTable)
      .set({
        title: todo.getTitle(),
        description: todo.getDescription(),
        completed: todo.getStatus().toBoolean(),
        updatedAt: todo.getUpdatedAt().toISOString(),
      })
      .where(eq(todosTable.id, todo.getId().toString()))
  }

  async delete(id: TodoId): Promise<void> {
    await this.drizzle
      .delete(todosTable)
      .where(eq(todosTable.id, id.toString()))
  }
}
