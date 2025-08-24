import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import type { Dependencies } from "../../../../../Dependencies"

const paramsSchema = z.object({
  filename: z.string().min(1),
})

export function v1AssetsFilenameGet(dependencies: Dependencies) {
  return new Hono<{ Bindings: CloudflareEnv }>().get(
    "/v1/assets/:filename",
    zValidator("param", paramsSchema),
    async (c) => {
      const { filename } = c.req.valid("param")

      try {
        const assetStorage = dependencies.getBucketRepository()

        const asset = await assetStorage.get(filename)

        if (!asset) {
          return c.json({ error: "File not found" }, 404)
        }
        const body = await asset.arrayBuffer()
        return c.body(body, 200, {
          "Content-Type": asset.httpMetadata?.contentType ?? "image/jpeg",
        })
      } catch (error) {
        console.error("Error fetching asset:", error)
        return c.json({ error: "Internal server error" }, 500)
      }
    }
  )
}
