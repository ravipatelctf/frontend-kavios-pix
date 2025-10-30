import { useParams } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet.js";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ImageCard } from "../components/ImageCard.jsx";

export default function AlbumDetails() {
    const { albumId } = useParams();
    console.log(albumId)

    const { data, loading, error, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}`);
    console.log(data);
    return (
        <>
            <main className="container">
                <section className="py-4">
                    <ul className="list-group">
                        <li className="list-group-item">
                            <h2>Album Details</h2>
                            <h5><strong>Name: </strong>{data?.data?.name}</h5>
                            <p><strong>Description: </strong>{data?.data?.description}</p>
                        </li>
                    </ul>
                </section>
                <section className="py-4">
                    <ImageManagement albumId={albumId} />
                </section>
            </main>
        </>
    );
}

function ImageUpload({setRefresh, albumId}) {
    const [imagePayload, setImagePayload] = useState({
        "image": null,
        "imageName": null
    });

    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!imagePayload["image"]) {
          toast.info("Please select an image to upload");
          return;
        }
        if (!imagePayload["imageName"]) {
          toast.warn("Image Name is required.");
          return;
        }
        toast.info("Uploading Image ...");
        const formData = new FormData();
        formData.append("image", imagePayload["image"]);
        formData.append("imageName", imagePayload["imageName"]);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images`,
            formData,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });
            
            toast.info("Image Uploaded Successfully.")
            setRefresh(pv => pv + 1);
            setImagePayload({});
            fileInputRef.current.value = ""; // resets file input
        } catch (error) {
            console.error(error);
            toast.error("Image Upload Failed.")
        }
    }

  return (
    <div>
      {/* Button trigger modal */}
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">
          + Upload Image
        </button>
      </div>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Image</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input type="file" onChange={(e) => setImagePayload(pv => ({...pv, "image": e.target.files[0]}))} ref={fileInputRef} className="mb-1" required/>
              <input type="text" onChange={(e) => setImagePayload(pv => ({...pv, "imageName": e.target.value}))} placeholder="Image Name" required/>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={(e) => handleImageUpload(e)}>Upload Image</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageManagement({ albumId }) {
    const [refresh, setRefresh] = useState(0);

    const { data, loading, error, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images`);

    useEffect(() => {
        fetchData();
    }, [refresh]);

  return (
    <>
      <main>
        <section className="mb-4">
            <ImageUpload setRefresh={setRefresh} albumId={albumId} />
        </section>
        <section>
            <div className="row">
                {
                    data ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(image => (
                        <div key={image._id} className="col-md-6">
                            <Link to={`/albums/${albumId}/images/${image._id}`} className="text-decoration-none">
                              <ImageCard image={image} setRefresh={setRefresh}/>
                            </Link>
                        </div>
                    )) : (
                        <p>Loading...</p>
                    )
                }
            </div>
        </section>
      </main>
    </>
  )
}