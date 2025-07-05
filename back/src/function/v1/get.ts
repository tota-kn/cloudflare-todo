import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createHonoApp } from '../../utils/hono'

export const v1Get = createHonoApp().get(
  '',
  zValidator(
    'query',
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
  (c) => {
    return c.json({
      message: 'API is OK!',
    })
  },
)
