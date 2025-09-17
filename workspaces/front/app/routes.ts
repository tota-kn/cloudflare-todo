import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  // ルート path: `/` → `/en/todos` にリダイレクト
  index("routes/index.tsx"),

  // 言語パラメータ付きルート
  route("/:lang", "routes/$lang/index.tsx"),
  route("/:lang/todos", "routes/$lang/todos/index.tsx"),
  route("/:lang/todos/new", "routes/$lang/todos/new.tsx"),
  route("/:lang/todos/:id", "routes/$lang/todos/$id.tsx"),

  // Chrome DevToolsが自動的にリクエストしてエラーログが出てくるため抑制
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "routes/devtools.tsx"
  ),
] satisfies RouteConfig
