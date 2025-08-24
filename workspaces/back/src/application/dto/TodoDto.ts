import { Todo } from "../../domain/entities/Todo"

/**
 * Todoのデータ転送オブジェクト
 * アプリケーション境界を跨ぐデータのやり取りに使用
 */
export interface TodoDto {
  id: string
  title: string
  description: string
  completed: boolean
  created_at: string
  updated_at: string
}

/**
 * TodoエンティティからTodoDTOに変換する
 * @param todo 変換元のTodoエンティティ
 * @returns 変換されたTodoDTO
 */
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
