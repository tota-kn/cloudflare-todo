import { Hono } from 'hono'
import { v1Get } from './function/v1/get'
import { indexGet } from './function/get'

const route = new Hono().route('', indexGet).route('/v1', v1Get)

const app = new Hono().route('', route)

export type RouteType = typeof route
export default app
