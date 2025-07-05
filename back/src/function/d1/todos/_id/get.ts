import { createHonoApp } from '../../../../utils/hono'

export const d1Get = createHonoApp()
  .get('', async (c) => {
    const id = c.req.param('id')

    try {
      const { results } = await c.env.DB.prepare('SELECT * FROM todos WHERE id = ?').bind(id).all()

      if (results.length === 0) {
        return c.json({ error: 'Todo not found' }, 404)
      }

      return c.json({ todo: results[0] })
    }
    catch (error) {
      console.error('Failed to get todo:', error)
      return c.json({ error: 'Failed to get todo' }, 500)
    }
  })