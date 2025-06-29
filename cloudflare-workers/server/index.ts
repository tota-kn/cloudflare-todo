// server/index.ts
import { Hono } from "hono";
import api from "./routes/api";
import { HonoContext } from "./types";

const app = new Hono<HonoContext>()
  .use(async (c, next) => {
    c.set("MY_VAR_IN_VARIABLES", "My variable set in c.set");
    await next();
    c.header("X-Powered-By", "React Router and Hono");
  })
  .route("/api", api);

export type AppType = typeof app;
export default app;
