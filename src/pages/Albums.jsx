import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus.js";
import { useFetchGet } from "../hooks/useFetchGet.js";
import { useFetchPost } from "../hooks/useFetchPost.js";

function AlbumCard({ album }) {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 p-2">
      <Link to={`/albums/${album._id}`} className="block">
        <div className="bg-gray-900 text-white rounded-xl p-4 h-full shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-1">{album?.name}</h3>
          <p className="text-sm text-gray-300">{album?.description}</p>
        </div>
      </Link>
    </div>
  );
}

function AlbumManagement() {
  const [refresh, setRefresh] = useState(0);
  const { data, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums`);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <CreateAlbum refresh={refresh} setRefresh={setRefresh} />
      </div>

      {data && data.data ? (
        <div className="flex flex-wrap -m-2">
          {[...data.data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
        </div>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
}

function CreateAlbum({ setRefresh }) {
  const [album, setAlbum] = useState({
    name: "",
    description: "",
    ownerId: "68fb0dbf5cb400e253facc77",
  });
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { fetchData: createAlbum } = useFetchPost(
    `${import.meta.env.VITE_SERVER_BASE_URL}/albums`
  );

  async function handleCreateAlbum() {
    if (!album.name.trim()) return;
    try {
      await createAlbum(album);
      setRefresh((pv) => pv + 1);
      setAlbum({ name: "", description: "", ownerId: "68fb0dbf5cb400e253facc77" });
      closeModal();
    } catch (error) {
      console.error("Failed to create album:", error);
    }
  }

  function closeModal() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowModal(false);
    }, 200); // matches the transition duration
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        + Create Album
      </button>

      {/* Modal with animation */}
      {showModal && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 transition-all duration-200 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Background overlay */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-200 ${
              isClosing ? "opacity-0" : "opacity-50"
            }`}
            onClick={closeModal}
          ></div>

          {/* Modal box */}
          <div
            className={`relative bg-white rounded-xl shadow-lg w-96 max-w-[90%] transform transition-all duration-200 ${
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="flex justify-between items-center border-b px-4 py-3">
              <h2 className="text-lg font-semibold">Album</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={album.name}
                  onChange={(e) => setAlbum((pv) => ({ ...pv, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={album.description}
                  onChange={(e) => setAlbum((pv) => ({ ...pv, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t px-4 py-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlbum}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Albums() {
  const navigate = useNavigate();
  const { loading, isAuthenticated, email } = useAuthStatus();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <p className="text-gray-400">Checking authentication...</p>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      {isAuthenticated ? (
        <>
          <p className="text-gray-700 text-lg mb-4 font-medium">
            Your Email: <span className="text-indigo-600 font-semibold">{email || "User"}</span>
          </p>
          <AlbumManagement />
        </>
      ) : (
        <p className="text-gray-400">Redirecting to login...</p>
      )}
    </main>
  );
}
