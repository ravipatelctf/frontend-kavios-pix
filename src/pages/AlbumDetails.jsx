import { useParams, Link } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet.js";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ImageCard } from "../components/ImageCard.jsx";

export default function AlbumDetails() {
  const { albumId } = useParams();
  const { data } = useFetchGet(
    `${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}`
  );

  return (
    <main className="max-w-5xl mx-auto p-6">
      <section className="mb-8 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Album Details</h2>
        <p className="text-lg text-gray-700">
          <strong>Name:</strong> {data?.data?.name}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Description:</strong> {data?.data?.description}
        </p>
      </section>

      <section>
        <ImageManagement albumId={albumId} />
      </section>
    </main>
  );
}

function ImageUpload({ setRefresh, albumId }) {
  const [showModal, setShowModal] = useState(false);
  const [imagePayload, setImagePayload] = useState({
    image: null,
    imageName: "",
  });
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imagePayload.image) {
      toast.info("Please select an image to upload");
      return;
    }
    if (!imagePayload.imageName) {
      toast.warn("Image Name is required.");
      return;
    }

    toast.info("Uploading Image...");
    const formData = new FormData();
    formData.append("image", imagePayload.image);
    formData.append("imageName", imagePayload.imageName);

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Image Uploaded Successfully!");
      setShowModal(false);
      setImagePayload({});
      fileInputRef.current.value = "";
      setRefresh((pv) => pv + 1);
    } catch (error) {
      console.error(error);
      toast.error("Image Upload Failed.");
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => setShowModal(true)}
        >
          + Upload Image
        </button>
      </div>

      {/* Modal (Tailwind + animation) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative animate-fadeIn">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">Upload Image</h1>

            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) =>
                  setImagePayload((pv) => ({
                    ...pv,
                    image: e.target.files[0],
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Image Name"
                onChange={(e) =>
                  setImagePayload((pv) => ({
                    ...pv,
                    imageName: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                onClick={handleImageUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageManagement({ albumId }) {
  const [refresh, setRefresh] = useState(0);
  const { data, fetchData } = useFetchGet(
    `${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images`
  );

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <main>
      <section className="mb-6">
        <ImageUpload setRefresh={setRefresh} albumId={albumId} />
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data ? (
            data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((image) => (
                <ImageCard key={image._id} image={image} setRefresh={setRefresh}/>
              ))
          ) : (
            <p className="text-gray-500 text-center">Loading...</p>
          )}
        </div>
      </section>
    </main>
  );
}

{/* <section>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {data ? (
      data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((image) => (
          <Link
            to={`/albums/${albumId}/images/${image._id}`}
            key={image._id}
            className="block hover:scale-[1.02] transition-transform"
          >
            <ImageCard image={image} setRefresh={setRefresh} />
          </Link>
        ))
    ) : (
      <p className="text-gray-500 text-center">Loading...</p>
    )}
  </div>
</section> */}