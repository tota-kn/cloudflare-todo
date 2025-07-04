import type { RouteType } from '.'
import { hc } from 'hono/client'

const client = hc<RouteType>('http://localhost:8787/')
const res = await client.test2.$get({
  query: {
    title: 'test',
    body: 'test',
  },
})
console.log(res)
