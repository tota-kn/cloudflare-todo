import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HonoContext } from "../types";

const api = new Hono<HonoContext>().get(
  "/",
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

export default api;