export class TodoAttachmentId {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('TodoAttachmentId cannot be empty')
    }
  }

  toString(): string {
    return this.value
  }

  equals(other: TodoAttachmentId): boolean {
    return this.value === other.value
  }
}
