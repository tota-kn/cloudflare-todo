import { hc } from 'hono/client'
import type { ClientType } from '../../shared/client'

export const createServerFetcher = (env: Env) => {
  if (env.IS_LOCAL) {
    return hc<ClientType>(env.API_BASE_URL)
  }
 else {
    return hc<ClientType>('http://example/', {
      fetch: env.BACKEND_API.fetch.bind(env.BACKEND_API),
    })
  }
}

export const createBrowserClient = () => {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin.includes('localhost')
      ? 'http://localhost:8787'
      : window.location.origin.includes('dev')
        ? 'https://todo-back-dev.omen-bt.workers.dev'
        : 'https://todo-back-prd.omen-bt.workers.dev'
    : 'http://localhost:8787'

  return hc<ClientType>(baseUrl)
}
