import { desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Attachment } from '../../../domain/entities/Attachment'
import { AttachmentId } from '../../../domain/value-objects/AttachmentId'
import { TodoId } from '../../../domain/value-objects/TodoId'
import { todoAttachmentsTable } from '../../database/schema'
import type { IAttachmentRepository } from './IAttachmentRepository'

export class D1AttachmentRepository implements IAttachmentRepository {
  private readonly drizzle

  constructor(db: D1Database) {
    this.drizzle = drizzle(db)
  }

  async save(attachment: Attachment): Promise<void> {
    await this.drizzle.insert(todoAttachmentsTable).values({
      id: attachment.getId().toString(),
      todoId: attachment.getTodoId().toString(),
      fileKey: attachment.getFileKey(),
      originalFilename: attachment.getOriginalFilename(),
      fileSize: attachment.getFileSize(),
      contentType: attachment.getContentType(),
      createdAt: attachment.getCreatedAt().toISOString(),
    })
  }

  async findById(id: AttachmentId): Promise<Attachment | null> {
    const result = await this.drizzle
      .select()
      .from(todoAttachmentsTable)
      .where(eq(todoAttachmentsTable.id, id.toString()))
      .get()

    if (!result) {
      return null
    }

    return this.mapToAttachment(result)
  }

  async findByTodoId(todoId: TodoId): Promise<Attachment[]> {
    const results = await this.drizzle
      .select()
      .from(todoAttachmentsTable)
      .where(eq(todoAttachmentsTable.todoId, todoId.toString()))
      .orderBy(desc(todoAttachmentsTable.createdAt))
      .all()

    return results.map(result => this.mapToAttachment(result))
  }

  async delete(id: AttachmentId): Promise<void> {
    await this.drizzle
      .delete(todoAttachmentsTable)
      .where(eq(todoAttachmentsTable.id, id.toString()))
  }

  async deleteByTodoId(todoId: TodoId): Promise<void> {
    await this.drizzle
      .delete(todoAttachmentsTable)
      .where(eq(todoAttachmentsTable.todoId, todoId.toString()))
  }

  private mapToAttachment(data: { id: string, todoId: string, fileKey: string, originalFilename: string, fileSize: number, contentType: string, createdAt: string }): Attachment {
    return new Attachment(
      new AttachmentId(data.id),
      new TodoId(data.todoId),
      data.fileKey,
      data.originalFilename,
      data.fileSize,
      data.contentType,
      new Date(data.createdAt),
    )
  }
}
