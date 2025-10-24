
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useFetchGet } from "../hooks/useFetchGet";

function AlbumCard({ album }) {
  return (
    <div className="col-md-4">
      <div className="card p-4 bg-dark text-light">
        <h3>{album?.name}</h3>
        <p>{album?.description}</p>
      </div>
    </div>
  );
}

function AlbumManagement() {
  const { data, loading, error, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums`);
  console.log("albums:", data);
  return (
    <div className="row">
      {
        data && data.data ? (
          data.data.map(album => (
            <AlbumCard key={album._id} album={album} />
          ))
        ) : (
          <p>Loading...</p>
        )
      }
    </div>
  );
}

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
    <main className="container">
      <h2>Dashboard page</h2>
      {isAuthenticated ? (
        <>
          <h1>Login Successful</h1>
          <p>Welcome, {email || "User"}</p>
          <div>
            <AlbumManagement />
          </div>
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </main>
  );
}


