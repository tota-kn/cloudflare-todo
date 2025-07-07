import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Dependencies } from './infrastructure/config/Dependencies'
import { createFileRoutes } from './presentation/routes/FileRoutes'
import { createTodoRoutes } from './presentation/routes/TodoRoutes'

export function createApp(env: CloudflareEnv) {
  const dependencies = new Dependencies(env)
  const todoController = dependencies.getTodoController()
  const fileController = dependencies.getFileController()

  const app = new Hono<{ Bindings: CloudflareEnv }>()
    .use(
      '*',
      cors({
        origin: (_, c) => c.env.CORS_ORIGIN,
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    )
    .get('/v1', c => c.json({ message: 'Hello from Cloudflare Workers!' }))
    .route('/v1/todos', createTodoRoutes(todoController))
    .route('/v1/files', createFileRoutes(fileController))

  return app
}
