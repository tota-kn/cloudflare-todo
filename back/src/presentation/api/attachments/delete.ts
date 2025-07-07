import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../infrastructure/config/Dependencies'

export function createDetachFileFromTodoApi(dependencies: Dependencies) {
  const app = new Hono<{ Bindings: CloudflareEnv }>()

  app.delete(
    '/v1/todos/:id/attachments/:attachmentId',
    zValidator('param', z.object({
      id: z.string(),
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

  return app
}
