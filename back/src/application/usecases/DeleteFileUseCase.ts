import { FileRepository } from '../../domain/repositories/FileRepository'
import { FileKey } from '../../domain/value-objects/FileKey'

export class DeleteFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(key: string): Promise<boolean> {
    const fileKey = new FileKey(key)
    const exists = await this.fileRepository.exists(fileKey)

    if (!exists) {
      return false
    }

    await this.fileRepository.delete(fileKey)
    return true
  }
}
