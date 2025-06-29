import { hc } from 'hono/client'
import type { AppType } from '../../server/index.js'

// RPC client for type-safe API calls  
export const client = hc<AppType>('http://localhost:5173/')

// Example usage:
// const res = await client.api.test.$get({
//   query: { name: 'John', count: '5' }
// })
// const data = await res.json() // Type-safe response