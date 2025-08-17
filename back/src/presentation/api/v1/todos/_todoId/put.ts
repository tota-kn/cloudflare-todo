import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../../../Dependencies'

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})

export function v1TodosTodoIdPut(dependencies: Dependencies) {
  const updateTodoUseCase = dependencies.getUpdateTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .put('/v1/todos/:todoId', zValidator('json', updateTodoSchema), async (c) => {
      try {
        const todoId = c.req.param('todoId')
        const validatedData = c.req.valid('json')

        const todo = await updateTodoUseCase.execute({
          todoId,
          title: validatedData.title,
          description: validatedData.description,
          completed: validatedData.completed,
        })

        if (!todo) {
          return c.json({ error: 'Todo not found' }, 404)
        }

        return c.json(todo)
      }
      catch (error) {
        console.error('Failed to update todo:', error)
        return c.json({ error: 'Failed to update todo' }, 500)
      }
    })
}
