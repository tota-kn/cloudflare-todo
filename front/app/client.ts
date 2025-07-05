import type { ClientType } from "../../shared/client";
import { hc } from "hono/client";

export const createClient = (env: Env) => {
  if (env.IS_LOCAL === "true") {
    return hc<ClientType>("http://localhost:8787/");
  }
  return hc<ClientType>("http://example/", {
    fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
  });
};
