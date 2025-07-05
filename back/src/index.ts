import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { d1Delete } from './function/d1/todos/_id/delete'
import { d1Get } from './function/d1/todos/_id/get'
import { d1List } from './function/d1/todos/get'
import { d1Post } from './function/d1/todos/post'
import { d1Put } from './function/d1/todos/_id/put'
import { indexGet } from './function/get'
import { r2Delete } from './function/r2/files/_key/delete'
import { r2Get } from './function/r2/files/_key/get'
import { r2List } from './function/r2/files/get'
import { r2Post } from './function/r2/files/post'
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
  .route('/', indexGet)
  .route('/v1', v1Get)
  .route('/r2/files', r2List)
  .route('/r2/files/:key', r2Get)
  .route('/r2/files', r2Post)
  .route('/r2/files/:key', r2Delete)
  .route('/d1/todos', d1List)
  .route('/d1/todos/:id', d1Get)
  .route('/d1/todos', d1Post)
  .route('/d1/todos/:id', d1Put)
  .route('/d1/todos/:id', d1Delete)

export type RouteType = typeof app
export default app
