import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'

export function createDeleteTodoApi(dependencies: Dependencies) {
  const deleteTodoUseCase = dependencies.getDeleteTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .delete(':id', async (c) => {
      try {
        const id = c.req.param('id')
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
