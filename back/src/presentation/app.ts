import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Dependencies } from '../Dependencies'
import { v1TodosTodoIdAttachmentsAttachmentIdDelete } from './api/v1/todos/_todoId/attachments/_attachmentId/delete'
import { v1TodosTodoIdAttachmentsGet } from './api/v1/todos/_todoId/attachments/get'
import { v1TodosTodoIdAttachmentsPost } from './api/v1/todos/_todoId/attachments/post'
import { v1TodosTodoIdDelete } from './api/v1/todos/_todoId/delete'
import { v1TodosTodoIdGet } from './api/v1/todos/_todoId/get'
import { v1TodosTodoIdPut } from './api/v1/todos/_todoId/put'
import { v1TodosGet } from './api/v1/todos/get'
import { v1TodosPost } from './api/v1/todos/post'

export function createApp(env: CloudflareEnv) {
  const dependencies = new Dependencies(env)

  return new Hono<{ Bindings: CloudflareEnv }>()
    .use(
      '*',
      cors({
        origin: (_, c) => c.env.CORS_ORIGIN,
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    )
    .get('/v1', c => c.json({ message: `${c.env.STAGE}: Hello from Cloudflare Workers!` }))
    .route('', v1TodosGet(dependencies))
    .route('', v1TodosPost(dependencies))
    .route('', v1TodosTodoIdGet(dependencies))
    .route('', v1TodosTodoIdPut(dependencies))
    .route('', v1TodosTodoIdDelete(dependencies))
    .route('', v1TodosTodoIdAttachmentsPost(dependencies))
    .route('', v1TodosTodoIdAttachmentsGet(dependencies))
    .route('', v1TodosTodoIdAttachmentsAttachmentIdDelete(dependencies))
}

export type AppType = ReturnType<typeof createApp>
