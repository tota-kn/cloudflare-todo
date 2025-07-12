import { createApp } from './presentation/app'

export type RouteType = ReturnType<typeof createApp>
export default {
  fetch: (request: Request, env: CloudflareEnv, ctx: ExecutionContext) => {
    const app = createApp(env)
    return app.fetch(request, env, ctx)
  },
}
