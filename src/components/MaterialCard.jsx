import { Link } from "react-router-dom";
import { FileType } from "../enums";
import { FaHeart, FaBookmark } from "react-icons/fa";
import { useState } from "react";
import { toggleSaveLater } from "../apis/materialApis";
import api from "../utils/api"; // Import api for toggleLike
import { toast } from "react-toastify";

const MaterialCard = ({ material }) => {
  const [isSaved, setIsSaved] = useState(material.is_saved || false);
  const [isLiked, setIsLiked] = useState(material.is_liked || false); // Initialize with is_liked

  const handleSave = async () => {
    const previousIsSaved = isSaved;
    setIsSaved(!isSaved); // Optimistic update

    try {
      const response = await toggleSaveLater(material.id);
      setIsSaved(response.saved);
      toast.success(response.message, {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err) {
      setIsSaved(previousIsSaved); // Revert on error
      toast.error(err.response?.data?.message || "Error toggling save status!", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Toggle save error:", err);
    }
  };

  const handleLike = async () => {
    const previousIsLiked = isLiked;
    setIsLiked(!isLiked); // Optimistic update

    try {
      if (previousIsLiked) {
        await api.delete(`/api/documents/${material.id}/like`);
        setIsLiked(false);
      } else {
        await api.post(`/api/documents/${material.id}/like`);
        setIsLiked(true);
      }

      toast.success(previousIsLiked ? 'Đã bỏ thích' : 'Đã thích', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err) {
      setIsLiked(previousIsLiked); // Revert on error
      toast.error(err.response?.data?.message || "Error toggling like status!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Toggle like error:", err);
    }
  };

  const formatViews = (views) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (views >= 1_000) return (views / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return views.toString();
  };

  return (
    <div className="w-96 h-80 p-2.5 bg-white rounded-md overflow-hidden">
      <div className="relative w-full h-2/3 rounded-xl overflow-hidden group">
        <Link
          to={`/material/${material.id}`}
          className="block w-full h-full bg-gray-200 flex justify-center items-center"
        >
          <img
            src={material.thumbnail_path}
            alt="thumbnail"
            className={`
              transition-all duration-300 
              ${material.file_type === FileType.PPT ? "w-full" : "h-full"} 
              group-hover:brightness-75
              group-hover:scale-105
            `}
          />
        </Link>

        {/* Heart button - top right corner */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center cursor-pointer
                    bg-black/70 text-white border border-white rounded-full opacity-0 
                    group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110 shadow-md"
        >
          <FaHeart
            className={`text-lg ${isLiked ? "text-red-500" : "hover:text-red-500"} transition-colors duration-200`}
          />
        </button>

        {/* Bookmark button - bottom right corner */}
        <button
          onClick={handleSave}
          className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center cursor-pointer
                    bg-black/70 text-white border border-white rounded-full opacity-0 
                    group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110 shadow-md"
        >
          <FaBookmark
            className={`text-lg ${isSaved ? "text-yellow-400" : "hover:text-yellow-400"} transition-colors duration-200`}
          />
        </button>
      </div>

      <div className="mt-2.5">
        <Link to={`/material/${material.id}`}>
          <p className="font-bold text-2xl line-clamp-2">{material.title}</p>
        </Link>
      </div>

      <Link to={`/user/${material.user.userId}`} className="hover:underline font-semibold text-[#00809D]">
        <p>{material.user.username}</p>
      </Link>
      <p className="text-gray-600 text-sm">
        {material.total_pages} trang · {formatViews(material.total_views)} lượt xem
      </p>
    </div>
  );
};

export default MaterialCard;