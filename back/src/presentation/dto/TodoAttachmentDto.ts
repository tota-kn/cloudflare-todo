import { TodoAttachment } from '../../domain/entities/TodoAttachment'

export interface TodoAttachmentDto {
  id: string
  todoId: string
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
  createdAt: string
}

export interface AttachFileToTodoRequestDto {
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
}

export interface TodoAttachmentResponseDto {
  id: string
  todoId: string
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
  createdAt: string
}

export class TodoAttachmentDtoMapper {
  static toResponseDto(attachment: TodoAttachment): TodoAttachmentResponseDto {
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

  static toDto(attachment: TodoAttachment): TodoAttachmentDto {
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
}
