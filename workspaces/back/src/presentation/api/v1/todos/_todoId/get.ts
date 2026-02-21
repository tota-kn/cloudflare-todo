import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { Dependencies } from "../../../../../Dependencies"
import type { AuthVariables } from "../../../../middleware/authMiddleware"
import { authMiddleware } from "../../../../middleware/authMiddleware"

export function v1TodosTodoIdGet(dependencies: Dependencies) {
  const getTodoUseCase = dependencies.getGetTodoUseCase()

  return new Hono<{
    Bindings: CloudflareEnv
    Variables: AuthVariables
  }>().get(
    "/v1/todos/:todoId",
    authMiddleware,
    zValidator("param", z.object({ todoId: z.string().min(1) })),
    async (c) => {
      try {
        const userId = c.get("userId")
        const { todoId } = c.req.valid("param")
        const todo = await getTodoUseCase.execute(todoId, userId)

        if (!todo) {
          return c.json({ error: "Todo not found" }, 404)
        }

        return c.json(todo)
      } catch (error) {
        console.error("Failed to get todo:", error)
        return c.json({ error: "Failed to get todo" }, 500)
      }
    }
  )
}
