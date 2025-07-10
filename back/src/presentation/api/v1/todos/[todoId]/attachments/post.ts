import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Dependencies } from '../../../../../../infrastructure/config/Dependencies'
import { AttachmentDtoMapper } from '../../../../../dto/AttachmentDto'

const attachFileSchema = z.object({
  fileKey: z.string().min(1, 'File key is required'),
  originalFilename: z.string().min(1, 'Original filename is required'),
  fileSize: z.number().min(0, 'File size must be non-negative'),
  contentType: z.string().min(1, 'Content type is required'),
})

export function v1TodosTodoIdAttachmentsPost(dependencies: Dependencies) {
  return new Hono<{ Bindings: CloudflareEnv }>().post(
    '/v1/todos/:todoId/attachments',
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
}
