import { Hono } from "hono"
import { cors } from "hono/cors"
import { Dependencies } from "../Dependencies"
import { testGet } from "./api/test/get"
import { v1AssetsFilenameGet } from "./api/v1/assets/_filename/get"
import { v1TodosTodoIdDelete } from "./api/v1/todos/_todoId/delete"
import { v1TodosTodoIdGet } from "./api/v1/todos/_todoId/get"
import { v1TodosTodoIdPut } from "./api/v1/todos/_todoId/put"
import { v1TodosGet } from "./api/v1/todos/get"
import { v1TodosPost } from "./api/v1/todos/post"

export function createApp(env: CloudflareEnv) {
  const dependencies = new Dependencies(env)

  return new Hono<{ Bindings: CloudflareEnv }>()
    .use(
      "*",
      cors({
        origin: (_, c) => c.env.CORS_ORIGIN,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    )
    .route("", testGet())
    .route("", v1AssetsFilenameGet(dependencies))
    .route("", v1TodosGet(dependencies))
    .route("", v1TodosPost(dependencies))
    .route("", v1TodosTodoIdGet(dependencies))
    .route("", v1TodosTodoIdPut(dependencies))
    .route("", v1TodosTodoIdDelete(dependencies))
}

export type AppType = ReturnType<typeof createApp>
