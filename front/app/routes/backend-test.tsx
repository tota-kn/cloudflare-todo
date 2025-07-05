import { useState, useEffect } from "react";
import type { Route } from "./+types/backend-test";
import { useFetcher } from "react-router";
import { createClientFetcher } from "~/client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Backend Test" },
    { name: "description", content: "Test backend API endpoint" },
  ];
}

export async function action({ context }: Route.ActionArgs) {
  const client = createClientFetcher(context.cloudflare.env);

  try {
    const req = await client.index.$get({
      query: {
        text: "test from frontend",
      },
    });
    const res = await req.json();
    return { success: true, message: res.message };
  } catch (error) {
    return {
      success: false,
      message:
        "Error: " + (error instanceof Error ? error.message : "Unknown error"),
    };
  }
}

export default function BackendTest() {
  const fetcher = useFetcher<typeof action>();
  const [result, setResult] = useState<string | null>(null);
  const [directResult, setDirectResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    fetcher.submit({}, { method: "post" });
  };

  const handleDirectFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8787/?text=test+from+browser");
      const data = await response.json();
      setDirectResult(data.message);
    } catch (error) {
      setDirectResult("Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetcher.data) {
      setResult(fetcher.data.message);
    }
  }, [fetcher.data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Backend Test Page</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Server-side fetch (推奨):</h2>
          <button
            onClick={handleButtonClick}
            disabled={fetcher.state === "submitting"}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            {fetcher.state === "submitting" ? "Loading..." : "Get Backend Result (Server)"}
          </button>
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded border text-gray-900">
              <h3 className="font-semibold text-gray-800">Result from Backend (Server):</h3>
              <p className="text-gray-900">{result}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Client-side fetch:</h2>
          <button
            onClick={handleDirectFetch}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            {loading ? "Loading..." : "Get Backend Result (Client)"}
          </button>
          {directResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded border text-gray-900">
              <h3 className="font-semibold text-gray-800">Result from Backend (Client):</h3>
              <p className="text-gray-900">{directResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
