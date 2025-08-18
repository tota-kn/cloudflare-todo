import { type RouteConfig, route } from "@react-router/dev/routes";

export default [  
  route("/", "routes/todos.tsx"),

  // Chrome DevToolsが自動的にリクエストしてエラーログが出てくるため抑制
  route("/.well-known/appspecific/com.chrome.devtools.json", "routes/devtools.tsx"),
] satisfies RouteConfig;
