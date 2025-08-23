import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"
import { Dependencies } from "../../../../Dependencies"

const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  completed: z.boolean().optional().default(false),
})

export function v1TodosPost(dependencies: Dependencies) {
  const createTodoUseCase = dependencies.getCreateTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>().post(
    "/v1/todos",
    zValidator("json", createTodoSchema),
    async (c) => {
      try {
        const validatedData = c.req.valid("json")

        const todo = await createTodoUseCase.execute({
          title: validatedData.title,
          description: validatedData.description,
        })

        return c.json(todo, 201)
      } catch (error) {
        console.error("Failed to create todo:", error)
        return c.json({ error: "Failed to create todo" }, 500)
      }
    }
  )
}
