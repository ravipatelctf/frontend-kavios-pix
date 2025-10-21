
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

export default function Dashboard() {
  const navigate = useNavigate();
  const { loading, isAuthenticated, email } = useAuthStatus();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <p>Checking authentication...</p>;

  return (
    <main>
      <h2>Dashboard page</h2>
      {isAuthenticated ? (
        <>
          <h1>Login Successful</h1>
          <p>Welcome, {email || "User"}</p>
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </main>
  );
}
