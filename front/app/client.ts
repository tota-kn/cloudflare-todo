import type { ClientType } from "../../shared/client";
import { hc } from "hono/client";

export const createClient = (baseUrl: Cloudflare.Env["API_BASE_URL"]) => {
  return hc<ClientType>(baseUrl);
};
