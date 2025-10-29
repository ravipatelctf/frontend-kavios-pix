// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

export default function Header() {
  const { loading, isAuthenticated, email } = useAuthStatus();

  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth route
    window.location.href = `${baseUrl}/auth/google`;
  };

  const handleLogout = async () => {
    try {
      // Call backend to clear JWT cookie
      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include", // include cookie for clearing
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear local data and redirect
      localStorage.removeItem("userEmail");
      window.location.href = "/";
    }
  };

  return (
    <header className="nav">
      <nav className="container py-3 navbar nav">
        <Link to={"/"} className="nav-link">KaviosPix</Link>
        <Link to={"/albums"} className="nav-link">Albums</Link>
        <Link to={"/images"} className="nav-link">Images</Link>
        <Link to={"/images/favorites"} className="nav-link">Favorites</Link>
        {loading ? (
          <span className="nav-link">Checking auth...</span>
        ) : isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        ) : (
          <button onClick={handleGoogleLogin} className="nav-link">Login with Google</button>
        )}
      </nav>
    </header>
  );
}
