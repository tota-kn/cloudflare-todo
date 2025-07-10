import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Dependencies } from './infrastructure/config/Dependencies'
// Todo APIs
import { v1TodosPost } from './presentation/api/v1/todos/post'
import { v1TodosGet } from './presentation/api/v1/todos/get'
import { v1TodosTodoIdGet } from './presentation/api/v1/todos/[todoId]/get'
import { v1TodosTodoIdPut } from './presentation/api/v1/todos/[todoId]/put'
import { v1TodosTodoIdDelete } from './presentation/api/v1/todos/[todoId]/delete'
import { v1TodosTodoIdAttachmentsPost } from './presentation/api/v1/todos/[todoId]/attachments/post'
import { v1TodosTodoIdAttachmentsGet } from './presentation/api/v1/todos/[todoId]/attachments/get'
import { v1TodosTodoIdAttachmentsAttachmentIdDelete } from './presentation/api/v1/todos/[todoId]/attachments/[attachmentId]/delete'
// Todo Attachment APIs

export function createApp(env: CloudflareEnv) {
  const dependencies = new Dependencies(env)

  const app = new Hono<{ Bindings: CloudflareEnv }>()
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

  return app
}
