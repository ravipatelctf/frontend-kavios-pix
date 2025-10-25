// src/hooks/useFetchGet.js
import { useState } from "react";

export function useFetchPost(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData(payload) {
    try {
      setLoading(true);

      // Send cookies with the request for backend auth
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important to include JWT cookie
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to create album.");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetchData };
}
