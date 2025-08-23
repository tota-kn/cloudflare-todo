import { Hono } from "hono"
import { Dependencies } from "../../../../Dependencies"

export function v1TodosGet(dependencies: Dependencies) {
  const listTodosUseCase = dependencies.getListTodosUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>().get("/v1/todos", async (c) => {
    try {
      const todos = await listTodosUseCase.execute()
      return c.json({
        items: todos,
      })
    } catch (error) {
      console.error("Failed to list todos:", error)
      return c.json({ error: "Failed to list todos" }, 500)
    }
  })
}
