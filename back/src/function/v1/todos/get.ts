import { createHonoApp } from '../../../utils/hono'

export const v1TodosGet = createHonoApp()
  .get('', async (c) => {
    try {
      const { results } = await c.env.DB.prepare('SELECT * FROM todos ORDER BY created_at DESC').all()
      return c.json({ todos: results })
    }
    catch (error) {
      console.error('Failed to list todos:', error)
      return c.json({ error: 'Failed to list todos' }, 500)
    }
  })
