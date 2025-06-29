// server/index.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{
  Bindings: {
    MY_VAR: string;
  };
  Variables: {
    MY_VAR_IN_VARIABLES: string;
  };
}>()
  .use(async (c, next) => {
    c.set("MY_VAR_IN_VARIABLES", "My variable set in c.set");
    await next();
    c.header("X-Powered-By", "React Router and Hono");
  })
  .get(
    "/api",
    zValidator(
      "query",
      z.object({
        name: z.string().min(1),
        count: z
          .string()
          .transform(Number)
          .pipe(z.number().min(1).max(100))
          .optional(),
      })
    ),
    (c) => {
      const { name, count } = c.req.valid("query");
      return c.json({
        message: "Test endpoint",
        timestamp: new Date().toISOString(),
        var: c.env.MY_VAR,
        params: {
          name: name || "anonymous",
          count: count || 1,
        },
      });
    }
  );

export type AppType = typeof app;
export default app;
