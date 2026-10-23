import { Hono } from "hono"
import { describe, expect, it } from "vite-plus/test"
import { z } from "zod"
import { validator } from "../../../../src/presentation/middleware/validator"

describe("validator", () => {
  const app = new Hono().post(
    "/",
    validator("json", z.object({ title: z.string().min(1) })),
    (c) => c.json(c.req.valid("json"))
  )

  it("検証に失敗したら 400 と文字列の error を返す", async () => {
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    })

    expect(res.status).toBe(400)
    const body = (await res.json()) as { error: string }
    expect(typeof body.error).toBe("string")
    expect(body.error).toContain("title")
  })

  it("検証に成功したらパース済みの値をハンドラに渡す", async () => {
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "a" }),
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ title: "a" })
  })
})
