import { hc } from "hono/client"
import type { ClientType } from "./types/shared"

export const createServerFetcher = (env: Env) => {
  if (env.IS_LOCAL) {
    return hc<ClientType>(env.API_BASE_URL)
  } else {
    return hc<ClientType>("http://example/", {
      fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
    })
  }
}

export const createBrowserClient = () => {
  if (
    typeof window === "undefined" ||
    window.location.host.includes("localhost")
  ) {
    return hc<ClientType>("http://localhost:8787")
  }

  return hc<ClientType>(`https://api.${window.location.hostname}`)
}
