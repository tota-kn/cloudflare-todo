import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { TodoDtoMapper } from '../../dto/TodoDto'

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})

export function createUpdateTodoApi(dependencies: Dependencies) {
  const updateTodoUseCase = dependencies.getUpdateTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .put('/v1/todos/:id', zValidator('json', updateTodoSchema), async (c) => {
      try {
        const id = c.req.param('id')
        const validatedData = c.req.valid('json')

        const todo = await updateTodoUseCase.execute({
          id,
          title: validatedData.title,
          description: validatedData.description,
          completed: validatedData.completed,
        })

        if (!todo) {
          return c.json({ error: 'Todo not found' }, 404)
        }

        return c.json({
          todo: TodoDtoMapper.toResponseDto(todo),
        })
      }
      catch (error) {
        console.error('Failed to update todo:', error)
        return c.json({ error: 'Failed to update todo' }, 500)
      }
    })
}
