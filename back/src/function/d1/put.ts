import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createHonoApp } from '../../utils/hono'

const todoUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})

export const d1Put = createHonoApp()
  .put('', zValidator('json', todoUpdateSchema), async (c) => {
    const id = c.req.param('id')
    const updates = c.req.valid('json')

    try {
      // まず存在確認
      const { results: existing } = await c.env.DB.prepare('SELECT * FROM todos WHERE id = ?').bind(id).all()

      if (existing.length === 0) {
        return c.json({ error: 'Todo not found' }, 404)
      }

      // 更新クエリを動的に構築
      const setParts = []
      const values = []

      if (updates.title !== undefined) {
        setParts.push('title = ?')
        values.push(updates.title)
      }
      if (updates.description !== undefined) {
        setParts.push('description = ?')
        values.push(updates.description)
      }
      if (updates.completed !== undefined) {
        setParts.push('completed = ?')
        values.push(updates.completed ? 1 : 0)
      }

      if (setParts.length === 0) {
        return c.json({ error: 'No fields to update' }, 400)
      }

      setParts.push('updated_at = CURRENT_TIMESTAMP')
      values.push(id)

      const query = `UPDATE todos SET ${setParts.join(', ')} WHERE id = ? RETURNING *`
      const { results } = await c.env.DB.prepare(query).bind(...values).all()

      return c.json({ todo: results[0] })
    }
    catch (error) {
      console.error('Failed to update todo:', error)
      return c.json({ error: 'Failed to update todo' }, 500)
    }
  })
