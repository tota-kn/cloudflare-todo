import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'

export function createDeleteFileApi(dependencies: Dependencies) {
  const deleteFileUseCase = dependencies.getDeleteFileUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .delete(':key', async (c) => {
      try {
        const key = c.req.param('key')
        const deleted = await deleteFileUseCase.execute(key)

        if (!deleted) {
          return c.json({ error: 'File not found' }, 404)
        }

        return c.json({ message: `File ${key} deleted successfully` })
      }
      catch (error) {
        console.error('Failed to delete file:', error)
        return c.json({ error: 'Failed to delete file' }, 500)
      }
    })
}
