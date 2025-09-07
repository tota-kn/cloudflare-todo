import { Hono } from "hono"

export function testGet() {
  return new Hono<{ Bindings: CloudflareEnv }>().get("/test", (c) =>
    c.json({ message: `${c.env.STAGE}: Hello from Cloudflare Workers!` })
  )
}
