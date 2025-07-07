import { useState } from "react";
import { createClientFetcher } from "~/client";

interface UsePingTestOptions {
  apiBaseUrl: string;
}

interface UsePingTestReturn {
  result: string | null;
  loading: boolean;
  error: string | null;
  testClientApi: () => Promise<void>;
}

export function usePingTest({ apiBaseUrl }: UsePingTestOptions): UsePingTestReturn {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testClientApi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const client = createClientFetcher(apiBaseUrl);
      const req = await client.v1.$get({
        query: {
          text: "test from browser",
        },
      });
      const res = await req.json();
      setResult(res.message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    error,
    testClientApi,
  };
}
