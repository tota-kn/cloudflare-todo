import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { Dependencies } from "../../../../../Dependencies"
import type { AuthVariables } from "../../../../middleware/authMiddleware"
import { authMiddleware } from "../../../../middleware/authMiddleware"

export function v1TodosTodoIdDelete(dependencies: Dependencies) {
  const deleteTodoUseCase = dependencies.getDeleteTodoUseCase()

  return new Hono<{
    Bindings: CloudflareEnv
    Variables: AuthVariables
  }>().delete(
    "/v1/todos/:todoId",
    authMiddleware,
    zValidator("param", z.object({ todoId: z.string().min(1) })),
    async (c) => {
      try {
        const userId = c.get("userId")
        const { todoId } = c.req.valid("param")
        const deleted = await deleteTodoUseCase.execute(todoId, userId)

        if (!deleted) {
          return c.json({ error: "Todo not found" }, 404)
        }

        return c.json({
          message: `Todo ${todoId} deleted successfully`,
        })
      } catch (error) {
        console.error("Failed to delete todo:", error)
        return c.json({ error: "Failed to delete todo" }, 500)
      }
    }
  )
}
