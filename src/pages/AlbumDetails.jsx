import { useParams, Link, useNavigate } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet.js";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ImageCard } from "../components/ImageCard.jsx";
import { MdDelete } from "react-icons/md";
import { useFetchDelete } from "../hooks/useFetchDelete.js";
import { useFetchPost } from "../hooks/useFetchPost.js";

export default function AlbumDetails() {
  const [albumDetails, setAlbumDetails] = useState({
    "name": "",
    "description": ""
  });
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { albumId } = useParams();
  const { data, fetchData: fetchAlbums } = useFetchGet(
    `${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}`
  );

  const { data: isAlbumDeleted, fetchData: deleteAlbum } = useFetchDelete(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}`);
  const {fetchData: updateAlbumDetails} = useFetchPost(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}`);


  useEffect(() => {
    setAlbumDetails(pv => ({...pv, "name": data?.data?.name, "description": data?.data?.description}));
  }, [data, editMode]);

  async function handleAlbumDelete() {
    try {
      await deleteAlbum();
        toast.success("Album deleted successfully.");
          navigate("/albums");
    } catch (error) {
      console.error("Failed to deleted album:". error);
      toast.error("Failed to delete album.");
    }
  }

  function handleCancelEditMode() {
    setAlbumDetails({
      name: "",
      description: ""
    });
    setEditMode(false);
  }

  async function handleAlbumDetailsUpdate() {
    try {
      await updateAlbumDetails(albumDetails);
      toast.success("Album details updated successfully.");
    } catch (error) {
      console.error("Failed to update album details:", error);
      toast.error("Failed to update album details.");
    } finally {
      setEditMode(false);
    }
  }
  
  return (
    <main className="max-w-5xl mx-auto p-6">
      <section className="mb-8 bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Album Details</h2>
          <button
              onClick={handleAlbumDelete}
              type="button"
              className="relative p-2 bg-red-600 text-white rounded-full hover:bg-red-600 hover:text-white transition hover:scale-120"
          >
            <MdDelete size={20} />
          </button>
        </div>

        <div>
          <p className="text-gray-700">
            <label htmlFor="name" className="font-bold">Name:</label>
            <br />
            <input type="text" value={albumDetails["name"] || ""} className="border rounded p-1" onChange={(e) => (editMode && setAlbumDetails(pv => ({...pv, "name": e.target.value})))}/>
          </p>
          <p className="text-gray-600 mt-2">
            <label htmlFor="description" className="font-bold">Description:</label>
            <br />
            <textarea id="description" cols={50} value={albumDetails["description"] || ""} className="border rounded p-2" onChange={(e) => (editMode && setAlbumDetails(pv => ({...pv, "description": e.target.value})))}></textarea>
          </p>
          {
            editMode ? (
              <div className="flex justify-end items-center gap-2">
                <button className="relative p-2 bg-red-600 text-white rounded hover:text-white transition hover:scale-105" onClick={(e) => handleCancelEditMode(e)}>Cancel</button>
                <button className="relative p-2 bg-indigo-600 text-white rounded hover:text-white transition hover:scale-105" onClick={(e) => handleAlbumDetailsUpdate(e)}>Update</button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button className="relative p-2 bg-indigo-600 text-white rounded hover:text-white transition hover:scale-105" onClick={(e) => setEditMode(true)}>Edit</button>
              </div>
            )
          }
        </div>
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
      <button
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        onClick={() => setShowModal(true)}
      >
        + Upload Image
      </button>

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

  if (data?.length == 0) {
    return (
      <main className="">
        <div className="text-center">
          <p className="mb-5 text-2xl text-gray-600">No Image found.</p>
          <ImageUpload setRefresh={setRefresh} albumId={albumId} />
        </div>
      </main>
    )
  }

  return (
    <main>
      <section className="flex justify-end mb-6">
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