import { useState } from "react";
import { Form, useSubmit } from "react-router";
import { createServerFetcher } from "~/client";
import type { Route } from "./+types/todos";

interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo List" },
    { name: "description", content: "Todo list page" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const client = createServerFetcher(context.cloudflare.env);
  const req = await client.v1.todos.$get();
  const res = await req.json();

  if ('error' in res) {
    throw new Error(res.error);
  }

  return {
    todos: res.todos,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const client = createServerFetcher(context.cloudflare.env);
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "create") {
    const title = formData.get("title");
    const description = formData.get("description");
    
    if (!title || typeof title !== "string") {
      throw new Error("Title is required");
    }
    
    await client.v1.todos.$post({
      json: {
        title,
        description: typeof description === "string" ? description || undefined : undefined,
      },
    });
  } else if (action === "update") {
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const completed = formData.get("completed") === "true";
    
    if (!id || typeof id !== "string") {
      throw new Error("ID is required");
    }
    if (!title || typeof title !== "string") {
      throw new Error("Title is required");
    }
    
    await client.v1.todos[":id"].$put({
      param: { id },
      json: {
        title,
        description: typeof description === "string" ? description || undefined : undefined,
        completed,
      },
    });
  } else if (action === "toggle") {
    const id = formData.get("id");
    const completed = formData.get("completed") === "true";
    
    if (!id || typeof id !== "string") {
      throw new Error("ID is required");
    }
    
    await client.v1.todos[":id"].$put({
      param: { id },
      json: {
        completed: !completed,
      },
    });
  } else if (action === "delete") {
    const id = formData.get("id");
    
    if (!id || typeof id !== "string") {
      throw new Error("ID is required");
    }
    
    await client.v1.todos[":id"].$delete({
      param: { id },
    });
  }

  return null;
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const submit = useSubmit();

  const handleToggleComplete = (todo: TodoItem) => {
    const formData = new FormData();
    formData.append("action", "toggle");
    formData.append("id", todo.id);
    formData.append("completed", todo.completed.toString());
    submit(formData, { method: "post" });
  };

  const handleDelete = (todo: TodoItem) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("id", todo.id);
      submit(formData, { method: "post" });
    }
  };

  const handleEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Todo List</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-200 text-black px-4 py-2 rounded hover:bg-blue-300"
        >
          {showForm ? 'Cancel' : 'Add Todo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">
            {editingTodo ? 'Edit Todo' : 'Create New Todo'}
          </h2>
          <Form method="post" onSubmit={handleCancelEdit}>
            <input type="hidden" name="action" value={editingTodo ? "update" : "create"} />
            {editingTodo && <input type="hidden" name="id" value={editingTodo.id} />}
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={editingTodo?.title || ""}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={editingTodo?.description || ""}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            
            {editingTodo && (
              <div className="mb-4">
                <label className="flex items-center text-black">
                  <input
                    type="checkbox"
                    name="completed"
                    defaultChecked={editingTodo.completed}
                    value="true"
                    className="mr-2"
                  />
                  Completed
                </label>
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-200 text-black px-4 py-2 rounded hover:bg-green-300"
              >
                {editingTodo ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </Form>
        </div>
      )}
      
      {loaderData.todos.length === 0 ? (
        <p className="text-black text-center py-8">No todos found. Create your first todo!</p>
      ) : (
        <div className="space-y-4">
          {loaderData.todos.map((todo: TodoItem) => (
            <div 
              key={todo.id} 
              className={`border rounded-lg p-4 ${
                todo.completed ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    todo.completed ? 'line-through text-gray-500' : 'text-black'
                  }`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`mt-1 text-sm ${
                      todo.completed ? 'text-gray-500' : 'text-black'
                    }`}>
                      {todo.description}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-gray-600">
                    Created: {new Date(todo.created_at).toLocaleDateString()}
                    {todo.updated_at !== todo.created_at && (
                      <span className="ml-2">
                        Updated: {new Date(todo.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    todo.completed 
                      ? 'bg-green-100 text-green-900' 
                      : 'bg-orange-100 text-orange-900'
                  }`}>
                    {todo.completed ? 'Completed' : 'Pending'}
                  </span>
                  <button
                    onClick={() => handleToggleComplete(todo)}
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      todo.completed
                        ? 'bg-orange-200 text-black hover:bg-orange-300'
                        : 'bg-green-200 text-black hover:bg-green-300'
                    }`}
                  >
                    {todo.completed ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => handleEdit(todo)}
                    className="px-3 py-1 text-xs rounded font-medium bg-blue-200 text-black hover:bg-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo)}
                    className="px-3 py-1 text-xs rounded font-medium bg-red-200 text-black hover:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}