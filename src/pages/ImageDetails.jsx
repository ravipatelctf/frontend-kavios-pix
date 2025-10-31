import { useParams } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet";
import { useEffect, useState } from "react";

export default function ImageDetails() {
  const [refresh, setRefresh] = useState(0);
  const { imageId, albumId } = useParams();

  const {
    data,
    loading,
    error,
    fetchData,
  } = useFetchGet(
    `${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images/${imageId}`
  );

  useEffect(() => {
    fetchData();
  }, [refresh]);

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
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Image Details
        </h2>
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
