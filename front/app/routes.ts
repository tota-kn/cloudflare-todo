import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  route("/todos", "routes/todos/index.tsx"),
  route("/todos/new", "routes/todos/new.tsx"),
  route("/todos/:id", "routes/todos/$id.tsx"),

  // Chrome DevToolsが自動的にリクエストしてエラーログが出てくるため抑制
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "routes/devtools.tsx"
  ),
] satisfies RouteConfig
