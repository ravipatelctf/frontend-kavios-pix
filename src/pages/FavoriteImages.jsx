import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useFetchGet } from "../hooks/useFetchGet";

export function FavoriteImages() {
    const navigate = useNavigate();
    const { loading, isAuthenticated } = useAuthStatus();
    const { data: favoriteImages } = useFetchGet(`${import.meta.env.VITE_SERVER_BASE_URL}/images/favorites`);

    // Redirect if not authenticated
    useEffect(() => {
    if (!loading && !isAuthenticated) {
        navigate("/");
    }
    }, [loading, isAuthenticated, navigate]);

    if (loading) return <p className="text-center">Checking authentication...</p>;
    return (
        <>
            <main>
                <div className="row py-4">
                    {
                        favoriteImages?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(image => (
                            <FavoriteImageCard key={image._id} image={image} />
                        ))
                    }
                </div>
            </main>
        </>
    );
}


function FavoriteImageCard({ image }) {
    return (
        <div className="col-md-6">
            <div className="card">
                <img src={`${image?.imageUrl}`} alt={`${image?.imageName}`} />
            </div>
        </div>
    );
}