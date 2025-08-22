export class TodoId {
  constructor(private readonly value: string) {
    this.validate()
  }

  private validate(): void {
    if (!this.value || this.value === '') {
      throw new Error('TodoId cannot be empty')
    }
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  equals(other: TodoId): boolean {
    return this.value === other.value
  }
}
