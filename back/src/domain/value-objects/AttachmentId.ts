export class AttachmentId {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('AttachmentId cannot be empty')
    }
  }

  toString(): string {
    return this.value
  }

  equals(other: AttachmentId): boolean {
    return this.value === other.value
  }
}
