import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false),
})

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})

export type CreateTodoSchema = z.infer<typeof createTodoSchema>
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>
