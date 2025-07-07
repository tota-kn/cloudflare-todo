import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { Dependencies } from '../../../infrastructure/config/Dependencies'
import { TodoDtoMapper } from '../../dto/TodoDto'
import { createTodoSchema, CreateTodoSchema } from '../../validators/TodoValidator'

export function createCreateTodoApi(dependencies: Dependencies) {
  const createTodoUseCase = dependencies.getCreateTodoUseCase()

  return new Hono<{ Bindings: CloudflareEnv }>()
    .post('', zValidator('json', createTodoSchema), async (c) => {
      try {
        const validatedData = c.req.valid('json') as CreateTodoSchema

        const todo = await createTodoUseCase.execute({
          title: validatedData.title,
          description: validatedData.description,
        })

        return c.json({
          todo: TodoDtoMapper.toResponseDto(todo),
        }, 201)
      }
      catch (error) {
        console.error('Failed to create todo:', error)
        return c.json({ error: 'Failed to create todo' }, 500)
      }
    })
}
