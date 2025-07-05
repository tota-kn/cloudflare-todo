import { createHonoApp } from '../../../../utils/hono'

export const r2Delete = createHonoApp()
  .delete('', async (c) => {
    const key = c.req.param('key')

    try {
      await c.env.STORAGE.delete(key)
      return c.json({ message: `File ${key} deleted successfully` })
    }
    catch (error) {
      console.error('Failed to delete file:', error)
      return c.json({ error: 'Failed to delete file' }, 500)
    }
  })