import { File } from '../entities/File'
import { FileKey } from '../value-objects/FileKey'

export interface FileRepository {
  list(): Promise<File[]>
  get(key: FileKey): Promise<R2ObjectBody | null>
  save(key: FileKey, content: ArrayBuffer): Promise<void>
  delete(key: FileKey): Promise<void>
  exists(key: FileKey): Promise<boolean>
}
