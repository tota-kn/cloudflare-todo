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
  const client = createClient(context.cloudflare.env);
  const req = await client.index.$get({
    query: {
      text: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    },
  });

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
