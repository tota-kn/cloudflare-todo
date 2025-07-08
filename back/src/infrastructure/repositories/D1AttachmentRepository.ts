import { Attachment } from '../../domain/entities/Attachment'
import type { AttachmentRepository } from '../../domain/repositories/AttachmentRepository'
import { AttachmentId } from '../../domain/value-objects/AttachmentId'
import { TodoId } from '../../domain/value-objects/TodoId'

export class D1AttachmentRepository implements AttachmentRepository {
  constructor(private readonly db: D1Database) {}

  async save(attachment: Attachment): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO todo_attachments (
        id, todo_id, file_key, original_filename, file_size, content_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    await stmt.bind(
      attachment.getId().toString(),
      attachment.getTodoId().toString(),
      attachment.getFileKey(),
      attachment.getOriginalFilename(),
      attachment.getFileSize(),
      attachment.getContentType(),
      attachment.getCreatedAt().toISOString(),
    ).run()
  }

  async findById(id: AttachmentId): Promise<Attachment | null> {
    const stmt = this.db.prepare(`
      SELECT id, todo_id, file_key, original_filename, file_size, content_type, created_at
      FROM todo_attachments
      WHERE id = ?
    `)

    const result = await stmt.bind(id.toString()).first()

    if (!result) {
      return null
    }

    return this.mapToAttachment(result)
  }

  async findByTodoId(todoId: TodoId): Promise<Attachment[]> {
    const stmt = this.db.prepare(`
      SELECT id, todo_id, file_key, original_filename, file_size, content_type, created_at
      FROM todo_attachments
      WHERE todo_id = ?
      ORDER BY created_at DESC
    `)

    const results = await stmt.bind(todoId.toString()).all()

    return results.results.map(result => this.mapToAttachment(result))
  }

  async delete(id: AttachmentId): Promise<void> {
    const stmt = this.db.prepare(`
      DELETE FROM todo_attachments
      WHERE id = ?
    `)

    await stmt.bind(id.toString()).run()
  }

  async deleteByTodoId(todoId: TodoId): Promise<void> {
    const stmt = this.db.prepare(`
      DELETE FROM todo_attachments
      WHERE todo_id = ?
    `)

    await stmt.bind(todoId.toString()).run()
  }

  private mapToAttachment(data: unknown): Attachment {
    const row = data as {
      id: string
      todo_id: string
      file_key: string
      original_filename: string
      file_size: number
      content_type: string
      created_at: string
    }
    return new Attachment(
      new AttachmentId(row.id),
      new TodoId(row.todo_id),
      row.file_key,
      row.original_filename,
      row.file_size,
      row.content_type,
      new Date(row.created_at),
    )
  }
}
