export class TodoStatus {
  private constructor(private readonly value: boolean) {}

  static completed(): TodoStatus {
    return new TodoStatus(true)
  }

  static pending(): TodoStatus {
    return new TodoStatus(false)
  }

  isCompleted(): boolean {
    return this.value
  }

  isPending(): boolean {
    return !this.value
  }

  toggle(): TodoStatus {
    return new TodoStatus(!this.value)
  }

  toBoolean(): boolean {
    return this.value
  }
}
