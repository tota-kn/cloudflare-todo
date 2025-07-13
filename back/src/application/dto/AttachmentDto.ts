import { Attachment } from '../../domain/entities/Attachment'

export interface AttachmentDto {
  id: string
  todoId: string
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
  createdAt: string
}

export const toAttachmentDto = (attachment: Attachment): AttachmentDto => {
  return {
    id: attachment.getId().toString(),
    todoId: attachment.getTodoId().toString(),
    fileKey: attachment.getFileKey(),
    originalFilename: attachment.getOriginalFilename(),
    fileSize: attachment.getFileSize(),
    contentType: attachment.getContentType(),
    createdAt: attachment.getCreatedAt().toISOString(),
  }
}
