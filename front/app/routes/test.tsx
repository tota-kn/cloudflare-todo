import { useState } from "react";
import { createClientFetcher } from "~/client";
import type { Route } from "./+types/test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Backend Test" },
    { name: "description", content: "Test backend API endpoint" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  return {
    apiBaseUrl: context.cloudflare.env.API_BASE_URL,
  };
}

export default function BackendTest({ loaderData }: Route.ComponentProps) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const client = createClientFetcher(loaderData.apiBaseUrl);
      const req = await client.index.$get({
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
      <h1 className="text-2xl font-bold mb-4">Backend Test Page</h1>
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Get Backend Result"}
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded border text-gray-900">
          <h2 className="font-semibold text-gray-800">Result from Backend:</h2>
          <p className="text-gray-900">{result}</p>
        </div>
      )}
    </div>
  );
}
