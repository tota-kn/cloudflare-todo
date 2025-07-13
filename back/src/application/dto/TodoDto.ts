import { Todo } from '../../domain/entities/Todo'

export interface TodoDto {
  id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export interface TodoCreateRequest {
  title: string
  description?: string
}

export interface TodoUpdateRequest {
  title?: string
  description?: string
  completed?: boolean
}

export const toTodoDto = (todo: Todo): TodoDto => {
  return {
    id: todo.getId().toString(),
    title: todo.getTitle(),
    description: todo.getDescription(),
    completed: todo.getStatus().isCompleted(),
    created_at: todo.getCreatedAt().toISOString(),
    updated_at: todo.getUpdatedAt().toISOString(),
  }
}
