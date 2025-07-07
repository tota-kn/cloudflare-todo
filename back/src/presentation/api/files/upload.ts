import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'

export function createUploadFileApi(dependencies: Dependencies) {
  const uploadFileUseCase = dependencies.getUploadFileUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .post(':key', async (c) => {
      try {
        const key = c.req.param('key')
        const body = await c.req.raw.arrayBuffer()

        await uploadFileUseCase.execute({ key, content: body })

        return c.json({ message: `File ${key} uploaded successfully` })
      }
      catch (error) {
        console.error('Failed to upload file:', error)
        return c.json({ error: 'Failed to upload file' }, 500)
      }
    })
}
