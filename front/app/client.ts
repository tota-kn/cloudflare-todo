import type { ClientType } from "../../shared/client";
import { hc } from "hono/client";

export const createClient = (env: Env) =>
  hc<ClientType>("http://localhost:8787", {
    fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
  });
