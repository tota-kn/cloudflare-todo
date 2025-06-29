import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { HonoContext } from "../types";

const postTestRoute = new Hono<HonoContext>().post(
  "/",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
  ),
  (c) => {
    const { title, description, tags } = c.req.valid("json");
    return c.json({
      message: "POST test endpoint",
      timestamp: new Date().toISOString(),
      data: {
        title,
        description: description || "",
        tags: tags || [],
      },
      env: c.env.MY_VAR,
    });
  }
);

export default postTestRoute;
