import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../infrastructure/config/Dependencies'

export function createDeleteTodoApi(dependencies: Dependencies) {
  const deleteTodoUseCase = dependencies.getDeleteTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .delete('/v1/todos/:todoId', zValidator('param', z.object({ id: z.string().min(1) })), async (c) => {
      try {
        const { id } = c.req.valid('param')
        const deleted = await deleteTodoUseCase.execute(id)

        if (!deleted) {
          return c.json({ error: 'Todo not found' }, 404)
        }

        return c.json({
          message: `Todo ${id} deleted successfully`,
        })
      }
      catch (error) {
        console.error('Failed to delete todo:', error)
        return c.json({ error: 'Failed to delete todo' }, 500)
      }
    })
}
