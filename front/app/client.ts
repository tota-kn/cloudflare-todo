import type { ClientType } from "../../shared/client";
import { hc } from "hono/client";

export const client = hc<ClientType>("http://localhost:8787/");

const res = await client.test2.$get({
  query: {
    title: "test",
    body: "test",
  },
});
console.log(res);
