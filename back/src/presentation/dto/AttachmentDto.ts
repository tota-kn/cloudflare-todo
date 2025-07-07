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

export interface AttachFileToTodoRequestDto {
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
}

export interface AttachmentResponseDto {
  id: string
  todoId: string
  fileKey: string
  originalFilename: string
  fileSize: number
  contentType: string
  createdAt: string
}

export class AttachmentDtoMapper {
  static toResponseDto(attachment: Attachment): AttachmentResponseDto {
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

  static toDto(attachment: Attachment): AttachmentDto {
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
