import { hc } from "hono/client"
import type { ClientType } from "./types/shared"
import { getApiUrl, isDev, isLocal, isPrd } from "./utils/env"

export const createServerFetcher = (env: Env) => {
  if (isLocal(env)) {
    return hc<ClientType>(env.API_BASE_URL)
  } else if (isDev(env) || isPrd(env)) {
    return hc<ClientType>("http://example/", {
      fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
    })
  } else {
    throw new Error("Unknown environment")
  }
}

export const createBrowserClient = () => hc<ClientType>(getApiUrl())
