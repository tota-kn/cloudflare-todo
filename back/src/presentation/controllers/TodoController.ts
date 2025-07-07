import { Context } from 'hono'
import { CreateTodoUseCase } from '../../application/usecases/CreateTodoUseCase'
import { DeleteTodoUseCase } from '../../application/usecases/DeleteTodoUseCase'
import { GetTodoUseCase } from '../../application/usecases/GetTodoUseCase'
import { ListTodosUseCase } from '../../application/usecases/ListTodosUseCase'
import { UpdateTodoUseCase } from '../../application/usecases/UpdateTodoUseCase'
import { TodoDtoMapper } from '../dto/TodoDto'
import { CreateTodoSchema, UpdateTodoSchema } from '../validators/TodoValidator'

export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getTodoUseCase: GetTodoUseCase,
    private readonly listTodosUseCase: ListTodosUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
  ) {}

  async listTodos(c: Context) {
    try {
      const todos = await this.listTodosUseCase.execute()
      return c.json({
        todos: TodoDtoMapper.toResponseDtoList(todos),
      })
    }
    catch (error) {
      console.error('Failed to list todos:', error)
      return c.json({ error: 'Failed to list todos' }, 500)
    }
  }

  async getTodo(c: Context) {
    try {
      const id = c.req.param('id')
      const todo = await this.getTodoUseCase.execute(id)

      if (!todo) {
        return c.json({ error: 'Todo not found' }, 404)
      }

      return c.json({
        todo: TodoDtoMapper.toResponseDto(todo),
      })
    }
    catch (error) {
      console.error('Failed to get todo:', error)
      return c.json({ error: 'Failed to get todo' }, 500)
    }
  }

  async createTodo(c: Context) {
    try {
      const validatedData = c.req.valid('json') as CreateTodoSchema

      const todo = await this.createTodoUseCase.execute({
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
  }

  async updateTodo(c: Context) {
    try {
      const id = c.req.param('id')
      const validatedData = c.req.valid('json') as UpdateTodoSchema

      const todo = await this.updateTodoUseCase.execute({
        id,
        title: validatedData.title,
        description: validatedData.description,
        completed: validatedData.completed,
      })

      if (!todo) {
        return c.json({ error: 'Todo not found' }, 404)
      }

      return c.json({
        todo: TodoDtoMapper.toResponseDto(todo),
      })
    }
    catch (error) {
      console.error('Failed to update todo:', error)
      return c.json({ error: 'Failed to update todo' }, 500)
    }
  }

  async deleteTodo(c: Context) {
    try {
      const id = c.req.param('id')
      const deleted = await this.deleteTodoUseCase.execute(id)

      if (!deleted) {
        return c.json({ error: 'Todo not found' }, 404)
      }

      return c.json({
        message: `Todo ${id} deleted successfully`,
      })
    }
    catch (error) {
      console.error('Failed to delete todo:', error)
      return c.json({ error: 'Failed to delete todo' }, 500)
    }
  }
}
