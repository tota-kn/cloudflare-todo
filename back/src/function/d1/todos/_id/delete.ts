import { createHonoApp } from '../../../../utils/hono'

export const d1Delete = createHonoApp()
  .delete('', async (c) => {
    const id = c.req.param('id')

    try {
      // まず存在確認
      const { results: existing } = await c.env.DB.prepare('SELECT * FROM todos WHERE id = ?').bind(id).all()

      if (existing.length === 0) {
        return c.json({ error: 'Todo not found' }, 404)
      }

      await c.env.DB.prepare('DELETE FROM todos WHERE id = ?').bind(id).run()

      return c.json({ message: `Todo ${id} deleted successfully` })
    }
    catch (error) {
      console.error('Failed to delete todo:', error)
      return c.json({ error: 'Failed to delete todo' }, 500)
    }
  })