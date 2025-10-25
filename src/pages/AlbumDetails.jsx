import { useParams } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet.js";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
                    <h2>Photos</h2>
                    <ImageManagement albumId={albumId} />
                </section>
            </main>
        </>
    );
}

function ImageManagement({ albumId }) {
    const [image, setImage] = useState(null);    
    const [refresh, setRefresh] = useState(0);

    const { data, loading, error, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images`);

    useEffect(() => {
        fetchData();
    }, [refresh]);

    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.info("Please select an image to upload");
            return;
        }
        toast.info("Uploading Image ...");
        const formData = new FormData();
        formData.append("image", image);
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images`,
            formData, 
            {
                headers: {
                "Content-Type": "multipart/form-data",
                }
            });
            
            toast.info("Image Uploaded Successfully.")
            setRefresh(pv => pv + 1);
            setImage(null);
            fileInputRef.current.value = ""; // resets file input
        } catch (error) {
            console.error(error);
            toast.error("Image Upload Failed.")
        }
    }
  return (
    <>
      <main>
        <section className="mb-4">
          <h1>Image Uploader</h1>
          <form onSubmit={(e) => handleUpload(e)}>
            <input type="file" onChange={(e) => handleImageUpload(e)} ref={fileInputRef} required/>
            <button type="submit">Upload</button>
          </form>
        </section>
        <section>
            <div className="row">
                {
                    data ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(image => (
                        <div key={image._id} className="col-md-6">
                            <div className="card mb-4">
                                <img src={`${image.imageUrl}`} alt="test image" className="img-fluid"/>
                            </div>
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