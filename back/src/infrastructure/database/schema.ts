import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const todosTable = sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const todoAttachmentsTable = sqliteTable('todo_attachments', {
  id: text('id').primaryKey(),
  todoId: text('todo_id').notNull(),
  fileKey: text('file_key').notNull(),
  originalFilename: text('original_filename').notNull(),
  fileSize: integer('file_size').notNull(),
  contentType: text('content_type').notNull(),
  createdAt: text('created_at').notNull(),
})

export type TodoSelect = typeof todosTable.$inferSelect
export type TodoInsert = typeof todosTable.$inferInsert
export type TodoAttachmentSelect = typeof todoAttachmentsTable.$inferSelect
export type TodoAttachmentInsert = typeof todoAttachmentsTable.$inferInsert
