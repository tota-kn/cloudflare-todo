import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const test1Route = new Hono().get(
  "",
  zValidator(
    "query",
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
  (c) => {
    return c.json({
      message: "API is OK!",
    });
  }
);
