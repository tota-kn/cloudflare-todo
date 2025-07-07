import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { AttachmentDtoMapper } from '../../dto/AttachmentDto'

const attachFileSchema = z.object({
  fileKey: z.string().min(1, 'File key is required'),
  originalFilename: z.string().min(1, 'Original filename is required'),
  fileSize: z.number().min(0, 'File size must be non-negative'),
  contentType: z.string().min(1, 'Content type is required'),
})

export function createAttachmentsApi(dependencies: Dependencies) {
  const app = new Hono<{ Bindings: CloudflareEnv }>()

  // GET /v1/todos/:todoId/attachments - List attachments
  app.get(
    ':todoId/attachments',
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

  // POST /v1/todos/:todoId/attachments - Attach file to todo
  app.post(
    ':todoId/attachments',
    zValidator('param', z.object({ todoId: z.string() })),
    zValidator('json', attachFileSchema),
    async (c) => {
      const { todoId } = c.req.valid('param')
      const attachRequest = c.req.valid('json')

      const useCase = dependencies.getAttachFileToTodoUseCase()

      try {
        const attachment = await useCase.execute(todoId, attachRequest)
        return c.json({
          success: true,
          data: AttachmentDtoMapper.toResponseDto(attachment),
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

  // DELETE /v1/todos/:todoId/attachments/:attachmentId - Detach file from todo
  app.delete(
    ':todoId/attachments/:attachmentId',
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

  return app
}
