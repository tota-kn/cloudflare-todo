import { useState } from "react";
import { createClientFetcher, createServerFetcher } from "~/client";
import { ResultDisplay } from "~/components/ResultDisplay";
import type { Route } from "./+types/home";

const title = "Ping Test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: title },
    { name: "description", content: "Test backend API endpoint" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const client = createServerFetcher(context.cloudflare.env);
    const req = await client.v1.$get({
      query: {
        text: context.cloudflare.env.VALUE_FROM_CLOUDFLARE || "test from server",
      },
    });
    const res = await req.json();
    
    return {
      apiBaseUrl: context.cloudflare.env.API_BASE_URL,
      serverResult: res.message,
    };
  } catch (error) {
    return {
      apiBaseUrl: context.cloudflare.env.API_BASE_URL,
      serverResult: "Server error: " + (error instanceof Error ? error.message : "Unknown error"),
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const client = createClientFetcher(loaderData.apiBaseUrl);
      const req = await client.v1.$get({
        query: {
          text: "test from browser",
        },
      });
      const res = await req.json();
      setResult(res.message);
    } catch (error) {
      setResult(
        "Error: " + (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      
      <div className="mb-6">
        <ResultDisplay
          title="Server-side Result:"
          result={loaderData.serverResult}
          type="server"
        />
      </div>
      
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Get Client-side Result"}
      </button>
      
      {result && (
        <div className="mt-4">
          <ResultDisplay
            title="Client-side Result:"
            result={result}
            type="client"
          />
        </div>
      )}
    </div>
  );
}
