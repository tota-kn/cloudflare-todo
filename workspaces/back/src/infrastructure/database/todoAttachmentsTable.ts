import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const todoAttachmentsTable = sqliteTable("todo_attachments", {
  id: text("id").primaryKey(),
  todoId: text("todo_id").notNull(),
  fileKey: text("file_key").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileSize: integer("file_size").notNull(),
  contentType: text("content_type").notNull(),
  createdAt: text("created_at").notNull(),
})
