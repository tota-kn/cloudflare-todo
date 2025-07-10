import { desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Todo } from '../../../domain/entities/Todo'
import { TodoId } from '../../../domain/value-objects/TodoId'
import { TodoDtoMapper } from '../../../presentation/dto/TodoDto'
import { todosTable } from '../../database/schema'
import type { ITodoRepository } from './TodoRepository'

export class D1TodoRepository implements ITodoRepository {
  private readonly drizzle

  constructor(db: D1Database) {
    this.drizzle = drizzle(db)
  }

  async save(todo: Todo): Promise<void> {
    const data = TodoDtoMapper.toResponseDto(todo)
    await this.drizzle.insert(todosTable).values({
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
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
    const data = TodoDtoMapper.toResponseDto(todo)
    await this.drizzle
      .update(todosTable)
      .set({
        title: data.title,
        description: data.description,
        completed: data.completed,
        updatedAt: data.updated_at,
      })
      .where(eq(todosTable.id, data.id))
  }

  async delete(id: TodoId): Promise<void> {
    await this.drizzle
      .delete(todosTable)
      .where(eq(todosTable.id, id.toString()))
  }
}
