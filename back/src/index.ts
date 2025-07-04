import { Hono } from "hono";
import { test1Route } from "./function/test/test1";
import { test2Route } from "./function/test/test2";

const route = new Hono().route("/", test1Route).route("/test2", test2Route);

const app = new Hono().route("/", route);

export type RouteType = typeof route;
export default app;
