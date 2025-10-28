import { useParams } from "react-router-dom";
import { useFetchGet } from "../hooks/useFetchGet";

export default function ImageDetails() {
    const { imageId } = useParams();
    const { albumId } = useParams();
    // console.log("imageId:", imageId);
    // console.log("albumId:", albumId);

    const { data, loading, error, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/albums/${albumId}/images/${imageId}`);
    // console.log("image:", data);
    return (
        <>
            <main className="container py-4">
                <p><strong>Image Name: </strong>{data?.imageName}</p>
                <p><strong>Size: </strong>{data?.size} bytes</p>
                <p><strong>Created At: </strong>{new Date(data?.createdAt).toDateString()}</p>
                <img src={data?.imageUrl} alt={data?.imageName} className="img-fluid" />
            </main>
        </>
    );
}