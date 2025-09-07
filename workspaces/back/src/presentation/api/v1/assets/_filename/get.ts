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

        const etag = `"${asset.etag}"`
        const cacheControl = "public, max-age=86400, immutable" // 1日間キャッシュ
        if (c.req.header("If-None-Match") === etag) {
          return new Response(null, {
            status: 304,
            headers: {
              ETag: etag,
              "Cache-Control": cacheControl,
            },
          })
        }

        const response = c.body(await asset.arrayBuffer(), 200, {
          "Content-Type": asset.httpMetadata?.contentType ?? "image/jpeg",
          "Cache-Control": cacheControl,
          ETag: etag,
        })

        return response
      } catch (error) {
        console.error("Error fetching asset:", error)
        return c.json({ error: "Internal server error" }, 500)
      }
    }
  )
}
