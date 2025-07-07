import { FileRepository } from '../../domain/repositories/FileRepository'
import { FileKey } from '../../domain/value-objects/FileKey'

export interface UploadFileRequest {
  key: string
  content: ArrayBuffer
}

export class UploadFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(request: UploadFileRequest): Promise<void> {
    const fileKey = new FileKey(request.key)
    await this.fileRepository.save(fileKey, request.content)
  }
}
