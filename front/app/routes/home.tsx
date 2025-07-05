import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { createClient } from "~/client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const backendService = context.cloudflare.env.BACKEND_API;
  console.log(
    "backendService:",
    backendService ? "available" : "not available"
  );
  console.log(backendService);
  const client = createClient(context.cloudflare.env);
  const req = await client.index.$get({
    query: {
      text: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    },
  });

  if (!req.ok) {
    console.error("API request failed:", req.status, req.statusText);
    const errorText = await req.text();
    console.error("Error response:", errorText);
    return {
      message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
      res: { message: "API request failed", error: errorText },
    };
  }

  const res = await req.json();
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    res,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Welcome message={loaderData.message} />
      <p>{loaderData.res.message || "failed"}</p>
    </div>
  );
}
