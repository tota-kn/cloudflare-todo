import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export const indexGet = new Hono<{ Bindings: CloudflareEnv }>().get(
  '',
  zValidator(
    'query',
    z.object({
      text: z.string().optional(),
    }),
  ),
  (c) => {
    const query = c.req.valid('query')
    const stage = c.env.STAGE
    return c.json({
      message: `${stage} is OK; text=${query.text}`,
    })
  },
)
