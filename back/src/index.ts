import { createApp } from './presentation/app'

export default {
  fetch: (request: Request, env: CloudflareEnv, ctx: ExecutionContext) => {
    const app = createApp(env)
    return app.fetch(request, env, ctx)
  },
}
