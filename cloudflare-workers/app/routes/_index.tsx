import { client } from "~/lib/api";
import type { Route } from "./+types/_index";

export const loader = async (args: Route.LoaderArgs) => {
  const extra = args.context.extra;
  const cloudflare = args.context.cloudflare;
  const myVarInVariables = args.context.hono.context.get("MY_VAR_IN_VARIABLES");
  const isWaitUntilDefined = !!cloudflare.ctx.waitUntil;

  // /apiエンドポイントを呼び出し
  const res = await client.api.$get({
    query: { name: "John", count: "5" },
  });
  const apiData = await res.json();

  return { cloudflare, extra, myVarInVariables, isWaitUntilDefined, apiData };
};

export default function Index({ loaderData }: Route.ComponentProps) {
  const { cloudflare, extra, myVarInVariables, isWaitUntilDefined, apiData } =
    loaderData;
  return (
    <div>
      <h1>React Router and Hono</h1>
      <h2>Var is {cloudflare.env.MY_VAR}</h2>
      <h3>
        {cloudflare.cf ? "cf," : ""}
        {cloudflare.ctx ? "ctx," : ""}
        {cloudflare.caches ? "caches are available" : ""}
      </h3>
      <h4>Extra is {extra}</h4>
      <h5>Var in Variables is {myVarInVariables}</h5>
      <h6>waitUntil is {isWaitUntilDefined ? "defined" : "not defined"}</h6>
      <h6>API Response: {JSON.stringify(apiData)}</h6>
    </div>
  );
}
