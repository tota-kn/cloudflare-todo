import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { TodoController } from '../controllers/TodoController'
import { createTodoSchema, updateTodoSchema } from '../validators/TodoValidator'

export function createTodoRoutes(todoController: TodoController) {
  return new Hono<{ Bindings: CloudflareEnv }>()
    .get('', c => todoController.listTodos(c))
    .post('', zValidator('json', createTodoSchema), c =>
      todoController.createTodo(c),
    )
    .get(':id', c => todoController.getTodo(c)).put(':id', zValidator('json', updateTodoSchema), c =>
      todoController.updateTodo(c),
    )
    .delete(':id', c => todoController.deleteTodo(c))
}
