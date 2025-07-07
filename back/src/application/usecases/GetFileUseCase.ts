import { FileRepository } from '../../domain/repositories/FileRepository'
import { FileKey } from '../../domain/value-objects/FileKey'

export class GetFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(key: string): Promise<R2ObjectBody | null> {
    const fileKey = new FileKey(key)
    return await this.fileRepository.get(fileKey)
  }
}
