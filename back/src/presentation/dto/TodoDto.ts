import { Todo } from '../../domain/entities/Todo'

export interface TodoResponseDto {
  id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateTodoRequestDto {
  title: string
  description?: string
  completed?: boolean
}

export interface UpdateTodoRequestDto {
  title?: string
  description?: string
  completed?: boolean
}

export class TodoDtoMapper {
  static toResponseDto(todo: Todo): TodoResponseDto {
    return {
      id: todo.getId().toString(),
      title: todo.getTitle(),
      description: todo.getDescription(),
      completed: todo.getStatus().isCompleted(),
      created_at: todo.getCreatedAt().toISOString(),
      updated_at: todo.getUpdatedAt().toISOString(),
    }
  }

  static toResponseDtoList(todos: Todo[]): TodoResponseDto[] {
    return todos.map(todo => this.toResponseDto(todo))
  }
}
