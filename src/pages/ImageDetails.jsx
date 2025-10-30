import { useParams } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet";
import { ImageCard } from "../components/ImageCard";
import { useEffect, useState } from "react";

export default function ImageDetails() {
    const [refresh, setRefresh] = useState(0);
    const { imageId } = useParams();
    const { albumId } = useParams();
    
    // console.log("imageId:", imageId);
    // console.log("albumId:", albumId);

    const { data, loading, error, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images/${imageId}`);
    // console.log("image:", data);

    useEffect(() => {
        fetchData();
    }, [refresh]);

    return (
        <>
            <main className="container py-4">
                <p><strong>Image Name: </strong>{data?.imageName}</p>
                <p><strong>Size: </strong>{data?.size} bytes</p>
                <p><strong>Created At: </strong>{new Date(data?.createdAt).toDateString()}</p>
                <ImageCard image={data} setRefresh={setRefresh} />
            </main>
        </>
    );
}