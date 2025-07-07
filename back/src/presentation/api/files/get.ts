import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'

export function createGetFileApi(dependencies: Dependencies) {
  const getFileUseCase = dependencies.getGetFileUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .get(':key', async (c) => {
      try {
        const key = c.req.param('key')
        const object = await getFileUseCase.execute(key)

        if (!object) {
          return c.json({ error: 'File not found' }, 404)
        }

        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)

        return new Response(object.body, { headers })
      }
      catch (error) {
        console.error('Failed to get file:', error)
        return c.json({ error: 'Failed to get file' }, 500)
      }
    })
}
