import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { indexGet } from './function/get'
import { v1Get } from './function/v1/get'

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

export type RouteType = typeof app
export default app
