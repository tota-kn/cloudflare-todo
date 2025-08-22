import { type RouteConfig, route } from "@react-router/dev/routes";

export default [  
  route("/todos", "routes/todos/index.tsx"),
  route("/todos/new", "routes/todos/new.tsx"),
  route("/todos/:id", "routes/todos/$id.tsx"),

  // Chrome DevToolsが自動的にリクエストしてエラーログが出てくるため抑制
  route("/.well-known/appspecific/com.chrome.devtools.json", "routes/devtools.tsx"),
] satisfies RouteConfig;
