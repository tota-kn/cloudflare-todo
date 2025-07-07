import { Todo } from '../../domain/entities/Todo'
import { TodoRepository } from '../../domain/repositories/TodoRepository'
import { TodoId } from '../../domain/value-objects/TodoId'
import { TodoDtoMapper } from '../../presentation/dto/TodoDto'

export class D1TodoRepository implements TodoRepository {
  constructor(private readonly db: D1Database) {}

  async save(todo: Todo): Promise<void> {
    const data = TodoDtoMapper.toResponseDto(todo)
    await this.db.prepare(
      'INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    ).bind(
      data.id,
      data.title,
      data.description,
      data.completed,
      data.created_at,
      data.updated_at,
    ).run()
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const result = await this.db.prepare('SELECT * FROM todos WHERE id = ?')
      .bind(id.toString())
      .first<{
      id: string
      title: string
      description: string | null
      completed: number
      created_at: string
      updated_at: string
    }>()

    if (!result) {
      return null
    }

    return Todo.fromData(result)
  }

  async findAll(): Promise<Todo[]> {
    const results = await this.db.prepare('SELECT * FROM todos ORDER BY created_at DESC')
      .all<{
      id: string
      title: string
      description: string | null
      completed: number
      created_at: string
      updated_at: string
    }>()

    return results.results.map(result => Todo.fromData(result))
  }

  async update(todo: Todo): Promise<void> {
    const data = TodoDtoMapper.toResponseDto(todo)
    await this.db.prepare(
      'UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = ? WHERE id = ?',
    ).bind(
      data.title,
      data.description,
      data.completed,
      data.updated_at,
      data.id,
    ).run()
  }

  async delete(id: TodoId): Promise<void> {
    await this.db.prepare('DELETE FROM todos WHERE id = ?')
      .bind(id.toString())
      .run()
  }
}
