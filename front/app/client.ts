import type { ClientType } from "../../shared/client";
import { hc } from "hono/client";

export const createServerFetcher = (env: Env) => {
  if (env.IS_LOCAL === "true") {
    return hc<ClientType>(env.API_BASE_URL);
  } else {
    return hc<ClientType>("http://example/", {
      fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
    });
  }
};

export const createClientFetcher = (baseUrl: string) => {
  return hc<ClientType>(baseUrl);
};
