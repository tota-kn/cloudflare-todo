export interface TodoWithTimestamp {
  updated_at: string
}

/**
 * Todoリストを更新日時の降順でソートする
 */
export const sortTodosByUpdatedAt = <T extends TodoWithTimestamp>(
  todos: T[]
): T[] => {
  return todos.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
}
