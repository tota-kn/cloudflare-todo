import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { v1FilesKeyDelete } from './function/v1/files/_key/delete'
import { v1FilesKeyGet } from './function/v1/files/_key/get'
import { v1FilesGet } from './function/v1/files/get'
import { v1FilesPost } from './function/v1/files/post'
import { v1Get } from './function/v1/get'
import { v1TodosIdDelete } from './function/v1/todos/_id/delete'
import { v1TodosIdGet } from './function/v1/todos/_id/get'
import { v1TodosIdPut } from './function/v1/todos/_id/put'
import { v1TodosGet } from './function/v1/todos/get'
import { v1TodosPost } from './function/v1/todos/post'

const app = new Hono<{ Bindings: CloudflareEnv }>()
  .use(
    '*',
    cors({
      origin: (_origin, c) => c.env.CORS_ORIGIN,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  )
  .route('v1', v1Get)
  .route('v1/files', v1FilesGet)
  .route('v1/files', v1FilesPost)
  .route('v1/files/:key', v1FilesKeyGet)
  .route('v1/files/:key', v1FilesKeyDelete)
  .route('v1/todos', v1TodosGet)
  .route('v1/todos', v1TodosPost)
  .route('v1/todos/:id', v1TodosIdGet)
  .route('v1/todos/:id', v1TodosIdPut)
  .route('v1/todos/:id', v1TodosIdDelete)

export type RouteType = typeof app
export default app
