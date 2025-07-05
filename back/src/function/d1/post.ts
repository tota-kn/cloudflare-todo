import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false),
})

export const d1Post = new Hono<{ Bindings: CloudflareEnv }>()
  .post('', zValidator('json', todoSchema), async (c) => {
    const todo = c.req.valid('json')

    try {
      const { results } = await c.env.DB.prepare(
        'INSERT INTO todos (title, description, completed) VALUES (?, ?, ?) RETURNING *',
      ).bind(todo.title, todo.description || null, todo.completed ? 1 : 0).all()

      return c.json({ todo: results[0] }, 201)
    }
    catch (error) {
      return c.json({ error: 'Failed to create todo' }, 500)
    }
  })
