import { Hono } from 'hono'

export const r2Post = new Hono<{ Bindings: CloudflareEnv }>()
  .post('', async (c) => {
    const key = c.req.param('key')
    const body = await c.req.raw.arrayBuffer()

    try {
      await c.env.STORAGE.put(key, body)
      return c.json({ message: `File ${key} uploaded successfully` })
    }
    catch (error) {
      console.error('Failed to upload file:', error)
      return c.json({ error: 'Failed to upload file' }, 500)
    }
  })
