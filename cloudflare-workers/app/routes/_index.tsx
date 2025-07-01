import { createClient } from "~/lib/api";
import type { Route } from "./+types/_index";
import { useState } from "react";

export const loader = async (args: Route.LoaderArgs) => {
  const extra = args.context.extra;
  const cloudflare = args.context.cloudflare;
  const myVarInVariables = args.context.hono.context.get("MY_VAR_IN_VARIABLES");
  const isWaitUntilDefined = !!cloudflare.ctx.waitUntil;

  // リクエストのホスト情報を取得してAPI_BASE_URLを構築
  const url = new URL(args.request.url);
  const API_BASE_URL = `${url.protocol}//${url.host}`;
  const client = createClient(API_BASE_URL);
  const response = await client.api.$get({
    query: { name: "a" },
  });
  console.log("API Response:", response.status, response.statusText);
  console.log(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`API request failed with status`);
  }
  // APIからのデータを取得
  const apiData = await response.json();

  return {
    cloudflare,
    extra,
    myVarInVariables,
    isWaitUntilDefined,
    apiData,
    API_BASE_URL,
  };
};

export default function Index({ loaderData }: Route.ComponentProps) {
  const {
    cloudflare,
    extra,
    myVarInVariables,
    isWaitUntilDefined,
    apiData,
    API_BASE_URL,
  } = loaderData;

  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleApiCall = async () => {
    setLoading(true);
    try {
      const client = createClient(API_BASE_URL);
      const response = await client.api.$get({
        query: { name: "a" },
      });
      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      setApiResult({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

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
      <h6>API Response: {API_BASE_URL}</h6>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleApiCall} disabled={loading}>
          {loading ? "Loading..." : "Request /api?name=a"}
        </button>
        {apiResult && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <strong>Result:</strong>
            <pre>{JSON.stringify(apiResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
