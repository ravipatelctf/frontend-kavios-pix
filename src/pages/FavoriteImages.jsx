import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useFetchGet } from "../hooks/useFetchGet";
import { ImageCard } from "../components/ImageCard";

export function FavoriteImages() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(0);
    const { loading, isAuthenticated } = useAuthStatus();
    const { data: favoriteImages, fetchData } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/images/favourites`);

    // Redirect if not authenticated
    useEffect(() => {
    if (!loading && !isAuthenticated) {
        navigate("/");
    }
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        fetchData();
    }, [refresh]);

    if (loading) return <p className="text-center">Checking authentication...</p>;
    return (
        <>
            <main className="container">
                <div className="row py-4">
                    {
                        favoriteImages?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(image => (
                            <div key={image._id} className="col-md-6">
                                <ImageCard image={image} refresh={refresh} setRefresh={setRefresh} />
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    );
}