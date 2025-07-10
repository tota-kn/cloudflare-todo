import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../../../../infrastructure/config/Dependencies'
import { AttachmentDtoMapper } from '../../../../../dto/AttachmentDto'

export function v1TodosTodoIdAttachmentsGet(dependencies: Dependencies) {
  return new Hono<{ Bindings: CloudflareEnv }>().get(
    '/v1/todos/:todoId/attachments',
    zValidator('param', z.object({ todoId: z.string() })),
    async (c) => {
      const { todoId } = c.req.valid('param')

      const useCase = dependencies.getGetAttachmentsUseCase()

      try {
        const attachments = await useCase.execute(todoId)
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
}
