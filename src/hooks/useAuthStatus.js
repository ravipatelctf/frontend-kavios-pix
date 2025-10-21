// src/hooks/useAuthStatus.js
import { useEffect, useState } from "react";

export function useAuthStatus() {
  const [status, setStatus] = useState({
    loading: true,
    isAuthenticated: false,
    email: null,
  });
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

  useEffect(() => {
    async function verifyAuth() {
      const storedEmail = localStorage.getItem("userEmail");

      try {
        // Check with backend whether the cookie is valid
        const res = await fetch(`${baseUrl}/auth/check`, {
          method: "GET",
          credentials: "include", // send cookies
        });

        if (res.ok) {
          // Backend verified JWT
          const result = await res.json();
          setStatus({
            loading: false,
            isAuthenticated: true,
            email: storedEmail || result.user?.email || null,
          });
        } else {
          // JWT invalid → remove local data
          localStorage.removeItem("userEmail");
          setStatus({
            loading: false,
            isAuthenticated: false,
            email: null,
          });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("userEmail");
        setStatus({
          loading: false,
          isAuthenticated: false,
          email: null,
        });
      }
    }

    verifyAuth();
  }, []);

  return status;
}
