import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { TodoAttachmentDtoMapper } from '../../dto/TodoAttachmentDto'

export function createListTodoAttachmentsApi(dependencies: Dependencies) {
  const app = new Hono<{ Bindings: CloudflareEnv }>()

  app.get(
    '/:todoId/attachments',
    zValidator('param', z.object({ todoId: z.string() })),
    async (c) => {
      const { todoId } = c.req.valid('param')

      const useCase = dependencies.getGetTodoAttachmentsUseCase()

      try {
        const attachments = await useCase.execute(todoId)
        return c.json({
          success: true,
          data: attachments.map(TodoAttachmentDtoMapper.toResponseDto),
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
