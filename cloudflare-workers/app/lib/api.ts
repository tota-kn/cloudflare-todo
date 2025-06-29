import { hc } from "hono/client";
import type { AppType } from "../../server/index.js";

export const createClient = (baseUrl: string) => hc<AppType>(baseUrl);
