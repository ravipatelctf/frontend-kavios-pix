
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFetchPost } from "../hooks/useFetchPost";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


export function ImageCard({ image, refresh, setRefresh }) {

    const { fetchData: toggleImageIsFavourite } = useFetchPost(`${import.meta.env.VITE_SERVER_BASE_URL}/images/${image?._id}/favourite`);

    async function handleImageIsFavouriteToggle(e) {
        if (image?.isFavourite) {
            toast.info("Removing from favourites.");
        } else {
            toast.info("Adding to favourites.");
        }
        try {
            const response = await toggleImageIsFavourite({"isFavourite": !image.isFavourite});
            setRefresh(pv => pv + 1);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div className="relative bg-gray-400 rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-200">
        <button
            onClick={handleImageIsFavouriteToggle}
            type="button"
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition"
        >
            {image?.isFavourite ? (
            <FaHeart className="text-red-500" />
            ) : (
            <FaRegHeart className="text-gray-500 hover:text-red-400" />
            )}
        </button>
        <Link
            to={`/images/${image._id}`}
            key={image._id}
            className=""
        >
            <img
                src={image?.imageUrl}
                alt={image?.imageName}
                className="w-full h-64 object-cover"
            />
        </Link>
        </div>

    );
}