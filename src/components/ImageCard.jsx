
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFetchPost } from "../hooks/useFetchPost";
import { toast } from "react-toastify";
import { useEffect } from "react";


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
        <div className="card mb-4 p-2">
            <div className="d-flex justify-content-end">
                <button onClick={(e) => handleImageIsFavouriteToggle(e)} className="btn" type="button">
                    {
                        image?.isFavourite ? ( <FaHeart color="red"/> ) : ( <FaRegHeart /> )
                    }
                </button>
            </div>
            <img src={`${image?.imageUrl}`} alt={`${image?.imageName}`} className="img-fluid"/>
        </div>
    );
}