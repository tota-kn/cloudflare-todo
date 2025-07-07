import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { TodoDtoMapper } from '../../dto/TodoDto'

export function createGetTodoApi(dependencies: Dependencies) {
  const getTodoUseCase = dependencies.getGetTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .get(':id', async (c) => {
      try {
        const id = c.req.param('id')
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
