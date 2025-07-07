import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { TodoDtoMapper } from '../../dto/TodoDto'
import { updateTodoSchema, UpdateTodoSchema } from '../../validators/TodoValidator'

export function createUpdateTodoApi(dependencies: Dependencies) {
  const updateTodoUseCase = dependencies.getUpdateTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .put(':id', zValidator('json', updateTodoSchema), async (c) => {
      try {
        const id = c.req.param('id')
        const validatedData = c.req.valid('json') as UpdateTodoSchema

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
