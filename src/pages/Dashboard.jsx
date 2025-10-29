
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus.js";
import { useFetchGet } from "../hooks/useFetchGet.js";
import { useFetchPost } from "../hooks/useFetchPost.js";

function AlbumCard({ album }) {
  return (
    <div className="col-md-4">
      <Link to={`/albums/${album._id}`} className="text-decoration-none">
      <div className="card p-4 bg-dark text-light mb-4">
        <h3>{album?.name}</h3>
        <p>{album?.description}</p>
      </div>
      </Link>
    </div>
  );
}

function AlbumManagement() {
  const [refresh, setRefresh] = useState(0);
  const { data, loading, error, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums`);

  useEffect(() => {
    fetchData();
    console.log("albums:", data);
  }, [refresh]);

  return (
    <div>
      <div className="d-flex justify-content-end">
        <CreateAlbum refresh={refresh} setRefresh={setRefresh}/>
      </div>
      <div className="row py-4">
        {
          data && data.data ? (
            [...data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))].map(album => (
              <AlbumCard key={album._id} album={album} />
            ))
          ) : (
            <p>Loading...</p>
          )
        }
      </div>
    </div>
  );
}

function CreateAlbum({setRefresh}) {
  const [ album, setAlbum ] = useState({"name": "", "description": "", "ownerId": "68fb0dbf5cb400e253facc77"});

  const { data, loading, error, fetchData: createAlbum } = useFetchPost(`${import.meta.env.VITE_SERVER_BASE_URL}/albums`);

  async function handleCreateAlbum() {
    if (!album["name"]) {
      return;
    }
    console.log("album:", album);

    try {
      await createAlbum(album);
      // console.log(data);
      setRefresh(pv => pv + 1);
    } catch (error) {
      console.error("Failed to create album:", error);
    }
    setAlbum({});
  }

  return (
    <div>
      {/* Button trigger modal */}
      <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
        + Create Album
      </button>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Album</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <label htmlFor="name" className="form-label">Name:</label>
                <input type="text" className="form-control" value={album["name"] || ""} onChange={(e) => setAlbum(pv => ({...pv, "name": e.target.value}))} required/>
                <label htmlFor="description">Description</label>
                <textarea id="description" className="form-control" value={album["description"] || ""} onChange={(e) => setAlbum(pv => ({...pv, "description": e.target.value}))}></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={(e) => handleCreateAlbum(e)}>Create Album</button>
            </div>
          </div>
        </div>
      </div>
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


