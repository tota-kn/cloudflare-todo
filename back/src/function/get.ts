import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export const indexGet = new Hono().get(
  '',
  zValidator(
    'query',
    z.object({
      text: z.string().optional(),
    }),
  ),
  (c) => {
    const query = c.req.valid('query')
    return c.json({
      message: `${query.text}: API is OK!`,
    })
  },
)
