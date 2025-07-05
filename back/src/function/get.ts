import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createHonoApp } from '../utils/hono'

export const indexGet = createHonoApp().get(
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
