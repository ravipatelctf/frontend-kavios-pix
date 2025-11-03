import { useNavigate, useParams } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useFetchDelete } from "../hooks/useFetchDelete";
import { toast } from "react-toastify";

export default function ImageDetails() {
  const [refresh, setRefresh] = useState(0);
  const { imageId, albumId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    loading,
    error,
    fetchData,
  } = useFetchGet(
    `${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images/${imageId}`
  );

  const {fetchData: deleteImage} = useFetchDelete(`${import.meta.env.VITE_SERVER_BASE_URL}/images/${imageId}`);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  async function handleImageDelete() {
    try {
      await deleteImage();
      toast.success("Image deleted successfully.");
      navigate("/images");
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading image details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load image details.
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <section className="bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Image Details
          </h2>
          <button
            onClick={handleImageDelete}
              type="button"
              className="relative p-2 bg-red-600 text-white rounded-full hover:bg-red-600 hover:text-white transition hover:scale-120"
          >
            <MdDelete size={20} />
          </button>
        </div>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Name:</strong> {data?.imageName}
          </p>
          <p>
            <strong>Size:</strong> {data?.size} bytes
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {data?.createdAt
              ? new Date(data.createdAt).toDateString()
              : "Unknown"}
          </p>
        </div>
      </section>

      {data?.imageUrl ? (
        <section className="flex justify-center">
            <img
                src={data?.imageUrl}
                alt={data?.imageName}
                className="rounded-lg shadow-lg max-h-[80vh]"
            />
        </section>
      ) : (
        <p className="text-center text-gray-500">No image available.</p>
      )}
    </main>
  );
}
