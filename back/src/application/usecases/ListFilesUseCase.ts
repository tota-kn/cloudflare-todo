import { File } from '../../domain/entities/File'
import { FileRepository } from '../../domain/repositories/FileRepository'

export class ListFilesUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(): Promise<File[]> {
    return await this.fileRepository.list()
  }
}
