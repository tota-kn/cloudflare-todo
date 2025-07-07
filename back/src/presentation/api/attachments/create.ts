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

export function createAttachFileToTodoApi(dependencies: Dependencies) {
  const app = new Hono<{ Bindings: CloudflareEnv }>()

  app.post(
    '/v1/todos/:id/attachments',
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', attachFileSchema),
    async (c) => {
      const { id } = c.req.valid('param')
      const attachRequest = c.req.valid('json')

      const useCase = dependencies.getAttachFileToTodoUseCase()

      try {
        const attachment = await useCase.execute(id, attachRequest)
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

  return app
}
