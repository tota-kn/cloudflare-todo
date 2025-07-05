import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { client } from "~/client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  // const res = await client.index.$get({
  //   query: {
  //     title: "test",
  //     body: "test",
  //   },
  // });
  // const a = await res.json();
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}
