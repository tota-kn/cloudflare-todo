import { FileKey } from '../value-objects/FileKey'

export class File {
  constructor(
    private readonly key: FileKey,
    private readonly size: number,
    private readonly uploadedAt: Date,
    private readonly etag: string,
    private readonly contentType?: string,
  ) {}

  static fromR2Object(obj: {
    key: string
    size: number
    uploaded: Date
    etag: string
    httpMetadata?: { contentType?: string }
  }): File {
    return new File(
      new FileKey(obj.key),
      obj.size,
      obj.uploaded,
      obj.etag,
      obj.httpMetadata?.contentType,
    )
  }

  getKey(): FileKey {
    return this.key
  }

  getSize(): number {
    return this.size
  }

  getUploadedAt(): Date {
    return this.uploadedAt
  }

  getEtag(): string {
    return this.etag
  }

  getContentType(): string | undefined {
    return this.contentType
  }

  toDto(): {
    key: string
    size: number
    uploaded: Date
    etag: string
    contentType?: string
  } {
    return {
      key: this.key.toString(),
      size: this.size,
      uploaded: this.uploadedAt,
      etag: this.etag,
      contentType: this.contentType,
    }
  }
}
