import { Hono } from 'hono'

export const createHonoApp = () => new Hono<{ Bindings: CloudflareEnv }>()
