// src/hooks/useFetchGet.js
import { useEffect, useState } from "react";

export function useFetchDelete(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);

      // Send cookies with the request for backend auth
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important to include JWT cookie
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
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
