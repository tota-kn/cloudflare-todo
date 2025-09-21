import { hc } from "hono/client"
import type { ClientType } from "./types/shared"
import { isDev, isLocal, isPrd } from "./utils/env"

export const createServerFetcher = (env: Env) => {
  if (isLocal(env)) {
    return hc<ClientType>(env.API_BASE_URL)
  } else if (isDev(env) || isPrd(env)) {
    return hc<ClientType>("http://example/", {
      fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
    })
  }
}

export const createBrowserClient = () => {
  if (isLocal()) {
    return hc<ClientType>("http://127.0.0.1:8787")
  } else if (isDev()) {
    return hc<ClientType>("https://api.dev.totakn.com")
  } else if (isPrd()) {
    return hc<ClientType>("https://api.totakn.com")
  }

  throw new Error("Unknown environment")
}
