import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../../../../../infrastructure/config/Dependencies'

export function v1TodosTodoIdAttachmentsAttachmentIdDelete(dependencies: Dependencies) {
  return new Hono<{ Bindings: CloudflareEnv }>().delete(
    '/v1/todos/:todoId/attachments/:attachmentId',
    zValidator('param', z.object({
      todoId: z.string(),
      attachmentId: z.string(),
    })),
    async (c) => {
      const { attachmentId } = c.req.valid('param')

      const useCase = dependencies.getDetachFileFromTodoUseCase()

      try {
        await useCase.execute(attachmentId)
        return c.json({
          success: true,
          message: 'Attachment deleted successfully',
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
