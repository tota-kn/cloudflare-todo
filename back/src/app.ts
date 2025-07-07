import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Dependencies } from './infrastructure/config/Dependencies'
// Todo APIs
import { createCreateTodoApi } from './presentation/api/todos/create'
import { createDeleteTodoApi } from './presentation/api/todos/delete'
import { createGetTodoApi } from './presentation/api/todos/get'
import { createListTodosApi } from './presentation/api/todos/list'
import { createUpdateTodoApi } from './presentation/api/todos/update'
// File APIs
import { createDeleteFileApi } from './presentation/api/files/delete'
import { createGetFileApi } from './presentation/api/files/get'
import { createListFilesApi } from './presentation/api/files/list'
import { createUploadFileApi } from './presentation/api/files/upload'

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
    .route('/v1/files', createListFilesApi(dependencies))
    .route('/v1/files', createGetFileApi(dependencies))
    .route('/v1/files', createUploadFileApi(dependencies))
    .route('/v1/files', createDeleteFileApi(dependencies))

  return app
}
