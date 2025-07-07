import { TodoId } from '../value-objects/TodoId'
import { TodoStatus } from '../value-objects/TodoStatus'

export class Todo {
  constructor(
    private readonly id: TodoId,
    private title: string,
    private description: string | null,
    private status: TodoStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    this.validateTitle()
  }

  static create(
    id: TodoId,
    title: string,
    description?: string,
  ): Todo {
    const now = new Date()
    return new Todo(
      id,
      title,
      description || null,
      TodoStatus.pending(),
      now,
      now,
    )
  }

  static fromData(data: {
    id: string
    title: string
    description: string | null
    completed: number
    created_at: string
    updated_at: string
  }): Todo {
    return new Todo(
      new TodoId(data.id),
      data.title,
      data.description,
      data.completed === 1 ? TodoStatus.completed() : TodoStatus.pending(),
      new Date(data.created_at),
      new Date(data.updated_at),
    )
  }

  private validateTitle(): void {
    if (!this.title || this.title.trim() === '') {
      throw new Error('Todo title cannot be empty')
    }
  }

  getId(): TodoId {
    return this.id
  }

  getTitle(): string {
    return this.title
  }

  getDescription(): string | null {
    return this.description
  }

  getStatus(): TodoStatus {
    return this.status
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateTitle(title: string): void {
    this.title = title
    this.validateTitle()
    this.updatedAt = new Date()
  }

  updateDescription(description: string | null): void {
    this.description = description
    this.updatedAt = new Date()
  }

  complete(): void {
    this.status = TodoStatus.completed()
    this.updatedAt = new Date()
  }

  markAsPending(): void {
    this.status = TodoStatus.pending()
    this.updatedAt = new Date()
  }

  toggleStatus(): void {
    this.status = this.status.toggle()
    this.updatedAt = new Date()
  }

  toData(): {
    id: string
    title: string
    description: string | null
    completed: number
    created_at: string
    updated_at: string
  } {
    return {
      id: this.id.toString(),
      title: this.title,
      description: this.description,
      completed: this.status.isCompleted() ? 1 : 0,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    }
  }
}
