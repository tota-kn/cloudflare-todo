import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { TodoDtoMapper } from '../../dto/TodoDto'

export function createGetTodoApi(dependencies: Dependencies) {
  const getTodoUseCase = dependencies.getGetTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .get('/v1/todos/:todoId', zValidator('param', z.object({ id: z.string().min(1) })), async (c) => {
      try {
        const { id } = c.req.valid('param')
        const todo = await getTodoUseCase.execute(id)

        if (!todo) {
          return c.json({ error: 'Todo not found' }, 404)
        }

        return c.json({
          todo: TodoDtoMapper.toResponseDto(todo),
        })
      }
      catch (error) {
        console.error('Failed to get todo:', error)
        return c.json({ error: 'Failed to get todo' }, 500)
      }
    })
}
