import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { indexGet } from './function/get'
import { v1Get } from './function/v1/get'
import { r2List } from './function/r2/list'
import { r2Get } from './function/r2/get'
import { r2Post } from './function/r2/post'
import { r2Delete } from './function/r2/delete'

const app = new Hono<{ Bindings: CloudflareEnv }>()
  .use(
    '*',
    cors({
      origin: (_origin, c) => c.env.CORS_ORIGIN,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  )
  .route('', indexGet)
  .route('/v1', v1Get)
  .route('/r2/files', r2List)
  .route('/r2/files', r2Get)
  .route('/r2/files', r2Post)
  .route('/r2/files', r2Delete)

export type RouteType = typeof app
export default app
