import { Hono } from 'hono'

export const r2List = new Hono<{ Bindings: CloudflareEnv }>()
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
    } catch (error) {
      return c.json({ error: 'Failed to list files' }, 500)
    }
  })