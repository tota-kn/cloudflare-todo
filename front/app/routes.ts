import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("backend-test", "routes/backend-test.tsx"),
] satisfies RouteConfig;
