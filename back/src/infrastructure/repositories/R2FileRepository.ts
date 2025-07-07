import { File } from '../../domain/entities/File'
import { FileRepository } from '../../domain/repositories/FileRepository'
import { FileKey } from '../../domain/value-objects/FileKey'

export class R2FileRepository implements FileRepository {
  constructor(private readonly storage: R2Bucket) {}

  async list(): Promise<File[]> {
    const list = await this.storage.list()
    return list.objects.map(obj => File.fromR2Object(obj))
  }

  async get(key: FileKey): Promise<R2ObjectBody | null> {
    return await this.storage.get(key.toString())
  }

  async save(key: FileKey, content: ArrayBuffer): Promise<void> {
    await this.storage.put(key.toString(), content)
  }

  async delete(key: FileKey): Promise<void> {
    await this.storage.delete(key.toString())
  }

  async exists(key: FileKey): Promise<boolean> {
    const object = await this.storage.head(key.toString())
    return object !== null
  }
}
