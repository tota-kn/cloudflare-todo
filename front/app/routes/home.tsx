import { createServerFetcher } from "~/client";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const client = createServerFetcher(context.cloudflare.env);
  const req = await client.v1.$get({
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
