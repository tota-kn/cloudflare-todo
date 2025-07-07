export class FileKey {
  constructor(private readonly value: string) {
    this.validate()
  }

  private validate(): void {
    if (!this.value || this.value.trim() === '') {
      throw new Error('FileKey cannot be empty')
    }

    if (this.value.includes('..') || this.value.includes('/')) {
      throw new Error('FileKey cannot contain path traversal characters')
    }
  }

  toString(): string {
    return this.value
  }

  equals(other: FileKey): boolean {
    return this.value === other.value
  }
}
