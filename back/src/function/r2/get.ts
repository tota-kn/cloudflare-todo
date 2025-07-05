import { createHonoApp } from '../../utils/hono'

export const r2Get = createHonoApp()
  .get('', async (c) => {
    const key = c.req.param('key')

    try {
      const object = await c.env.STORAGE.get(key)

      if (!object) {
        return c.json({ error: 'File not found' }, 404)
      }
      const headers = new Headers()
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)

      return new Response(object.body, { headers })
    }
    catch (error) {
      console.error('Failed to get file:', error)
      return c.json({ error: 'Failed to get file' }, 500)
    }
  })
