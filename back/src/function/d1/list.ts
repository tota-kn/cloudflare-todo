import { Hono } from 'hono'

export const d1List = new Hono<{ Bindings: CloudflareEnv }>()
  .get('', async (c) => {
    try {
      const { results } = await c.env.DB.prepare('SELECT * FROM todos ORDER BY created_at DESC').all()
      return c.json({ todos: results })
    }
    catch (error) {
      return c.json({ error: 'Failed to list todos' }, 500)
    }
  })
