import { AttachmentId } from '../value-objects/AttachmentId'
import { TodoId } from '../value-objects/TodoId'

export class Attachment {
  constructor(
    private readonly id: AttachmentId,
    private readonly todoId: TodoId,
    private readonly fileKey: string,
    private readonly originalFilename: string,
    private readonly fileSize: number,
    private readonly contentType: string,
    private readonly createdAt: Date,
  ) {
    this.validateOriginalFilename(originalFilename)
    this.validateFileSize(fileSize)
    this.validateContentType(contentType)
  }

  private validateOriginalFilename(filename: string): void {
    if (!filename || filename.trim().length === 0) {
      throw new Error('Original filename cannot be empty')
    }
    if (filename.length > 255) {
      throw new Error('Original filename is too long')
    }
  }

  private validateFileSize(size: number): void {
    if (size < 0) {
      throw new Error('File size cannot be negative')
    }
    if (size > 100 * 1024 * 1024) { // 100MB limit
      throw new Error('File size exceeds maximum limit')
    }
  }

  private validateContentType(type: string): void {
    if (!type || type.trim().length === 0) {
      throw new Error('Content type cannot be empty')
    }
  }

  getId(): AttachmentId {
    return this.id
  }

  getTodoId(): TodoId {
    return this.todoId
  }

  getFileKey(): string {
    return this.fileKey
  }

  getOriginalFilename(): string {
    return this.originalFilename
  }

  getFileSize(): number {
    return this.fileSize
  }

  getContentType(): string {
    return this.contentType
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  equals(other: Attachment): boolean {
    return this.id.equals(other.id)
  }
}
