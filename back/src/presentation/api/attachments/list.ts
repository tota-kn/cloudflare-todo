import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { AttachmentDtoMapper } from '../../dto/AttachmentDto'

export function createListAttachmentsApi(dependencies: Dependencies) {
  const app = new Hono<{ Bindings: CloudflareEnv }>()

  app.get(
    '/v1/todos/:id/attachments',
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid('param')

      const useCase = dependencies.getGetAttachmentsUseCase()

      try {
        const attachments = await useCase.execute(id)
        return c.json({
          success: true,
          data: attachments.map(AttachmentDtoMapper.toResponseDto),
        })
      }
      catch (error) {
        return c.json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }, 400)
      }
    },
  )

  return app
}
