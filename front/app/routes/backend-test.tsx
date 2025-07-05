import { useState, useEffect } from "react";
import type { Route } from "./+types/backend-test";
import { useFetcher } from "react-router";
import { createClient } from "~/client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Backend Test" },
    { name: "description", content: "Test backend API endpoint" },
  ];
}

export async function action({ context }: Route.ActionArgs) {
  const client = createClient(context.cloudflare.env);

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

  const handleButtonClick = () => {
    fetcher.submit({}, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.data) {
      setResult(fetcher.data.message);
    }
  }, [fetcher.data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Backend Test Page</h1>
      <button
        onClick={handleButtonClick}
        disabled={fetcher.state === "submitting"}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
      >
        {fetcher.state === "submitting" ? "Loading..." : "Get Backend Result"}
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
