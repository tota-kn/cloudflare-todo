import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createServerFetcher } from '~/client'
import { TodoEditor } from '~/components/TodoEditor'
import { useCreateTodo } from '~/hooks/useTodos'
import type { Route } from './+types/new'

export function meta() {
  return [
    { title: 'Create New Todo' },
    { name: 'description', content: 'Create a new todo item' },
  ]
}

export async function loader({ context }: Route.LoaderArgs) {
  return {
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const client = createServerFetcher(context.cloudflare.env)

  const formData = await request.formData()
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  const req = await client.v1.todos.$post({
    json: { title, description: description || undefined },
  })

  const res = await req.json()

  if ('error' in res) {
    throw new Error(res.error)
  }

  return { todo: res }
}

export default function TodoNew() {
  const navigate = useNavigate()
  const createTodo = useCreateTodo()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = () => {
    if (title.length > 0) {
      createTodo.mutate(
        { title, description },
        {
          onSuccess: () => {
            navigate('/todos')
          },
        },
      )
    }
  }

  const handleCancel = () => {
    setTitle('')
    setDescription('')
    navigate('/todos')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Create New Todo</h1>
        <button
          onClick={() => navigate('/todos')}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          ← Back to List
        </button>
      </div>

      <TodoEditor
        mode="create"
        initialTitle={title}
        initialDescription={description}
        todo={undefined}
        onSave={(newTitle: string, newDescription?: string) => {
          setTitle(newTitle)
          setDescription(newDescription || '')
        }}
        onCancel={() => {}}
        showTimestamps={false}
      />

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={title.length === 0 || createTodo.isPending}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTodo.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
