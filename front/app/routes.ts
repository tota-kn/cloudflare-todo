import { type RouteConfig, route } from "@react-router/dev/routes";

export default [  
  route("/","routes/home.tsx"),
  route("/test", "routes/test.tsx"),
  route("/todos", "routes/todos.tsx"),
] satisfies RouteConfig;
