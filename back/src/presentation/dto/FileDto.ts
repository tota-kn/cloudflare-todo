import { File } from '../../domain/entities/File'

export interface FileResponseDto {
  key: string
  size: number
  uploaded: string
  etag: string
  contentType?: string
}

export class FileDtoMapper {
  static toResponseDto(file: File): FileResponseDto {
    return {
      key: file.getKey().toString(),
      size: file.getSize(),
      uploaded: file.getUploadedAt().toISOString(),
      etag: file.getEtag(),
      contentType: file.getContentType(),
    }
  }

  static toResponseDtoList(files: File[]): FileResponseDto[] {
    return files.map(file => this.toResponseDto(file))
  }
}
