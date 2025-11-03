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

    if (!favoriteImages || favoriteImages?.length == 0) {
        return (
            <main className="py-5">
                <p className="text-center text-2xl text-gray-600">No Favourite Image found</p>
            </main>
        );
    }

    return (

        <main className="w-full px-4 py-6">
        <div
            className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-6 
            max-w-7xl 
            mx-auto
            "
        >
            {favoriteImages
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((image) => (
                <ImageCard
                key={image._id}
                image={image}
                refresh={refresh}
                setRefresh={setRefresh}
                />
            ))}
        </div>
        </main>

    );
}