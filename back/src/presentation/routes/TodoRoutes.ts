import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { TodoController } from '../controllers/TodoController'
import { createTodoSchema, updateTodoSchema } from '../validators/TodoValidator'

export function createTodoRoutes(todoController: TodoController) {
  const todoRoutes = new Hono<{ Bindings: CloudflareEnv }>()

  todoRoutes.get('/', c => todoController.listTodos(c))

  todoRoutes.post('/', zValidator('json', createTodoSchema), c =>
    todoController.createTodo(c),
  )

  todoRoutes.get('/:id', c => todoController.getTodo(c))

  todoRoutes.put('/:id', zValidator('json', updateTodoSchema), c =>
    todoController.updateTodo(c),
  )

  todoRoutes.delete('/:id', c => todoController.deleteTodo(c))

  return todoRoutes
}
