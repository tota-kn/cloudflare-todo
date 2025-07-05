import { createHonoApp } from '../../utils/hono'

export const r2List = createHonoApp()
  .get('', async (c) => {
    try {
      const list = await c.env.STORAGE.list()
      const files = list.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        etag: obj.etag,
      }))
      return c.json({ files })
    }
    catch (error) {
      console.error('Failed to list files:', error)
      return c.json({ error: 'Failed to list files' }, 500)
    }
  })
