import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Dependencies } from './infrastructure/config/Dependencies'
// Todo APIs
import { createAttachFileToTodoApi } from './presentation/api/attachments/create'
import { createDetachFileFromTodoApi } from './presentation/api/attachments/delete'
import { createListTodoAttachmentsApi } from './presentation/api/attachments/list'
import { createCreateTodoApi } from './presentation/api/todos/create'
import { createDeleteTodoApi } from './presentation/api/todos/delete'
import { createGetTodoApi } from './presentation/api/todos/get'
import { createListTodosApi } from './presentation/api/todos/list'
import { createUpdateTodoApi } from './presentation/api/todos/update'
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
    .route('/v1/todos', createListTodosApi(dependencies))
    .route('/v1/todos', createCreateTodoApi(dependencies))
    .route('/v1/todos', createGetTodoApi(dependencies))
    .route('/v1/todos', createUpdateTodoApi(dependencies))
    .route('/v1/todos', createDeleteTodoApi(dependencies))
    .route('/v1/todos', createAttachFileToTodoApi(dependencies))
    .route('/v1/todos', createListTodoAttachmentsApi(dependencies))
    .route('/v1/todos', createDetachFileFromTodoApi(dependencies))

  return app
}
