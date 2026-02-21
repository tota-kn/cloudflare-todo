import { Hono } from "hono"
import { Dependencies } from "../../../../Dependencies"
import type { AuthVariables } from "../../../middleware/authMiddleware"
import { authMiddleware } from "../../../middleware/authMiddleware"

export function v1TodosGet(dependencies: Dependencies) {
  const listTodosUseCase = dependencies.getListTodosUseCase()

  return new Hono<{
    Bindings: CloudflareEnv
    Variables: AuthVariables
  }>().get("/v1/todos", authMiddleware, async (c) => {
    try {
      const userId = c.get("userId")
      const todos = await listTodosUseCase.execute(userId)
      return c.json({
        items: todos,
      })
    } catch (error) {
      console.error("Failed to list todos:", error)
      return c.json({ error: "Failed to list todos" }, 500)
    }
  })
}
