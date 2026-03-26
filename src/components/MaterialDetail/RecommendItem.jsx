import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileType } from '../../enums';
import { FaBookmark } from 'react-icons/fa';
import { toggleSaveLater } from '../../apis/materialApis';
import { toast } from 'react-toastify';

const RecommendItem = ({ material }) => {
  const [isSaved, setIsSaved] = useState(material.is_saved || false);

  const handleSave = async () => {
    const previousIsSaved = isSaved;
    setIsSaved(!isSaved);

    try {
      const response = await toggleSaveLater(material.id);
      setIsSaved(response.saved);
      toast.success(response.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    } catch (err) {
      setIsSaved(previousIsSaved);
      toast.error(err.response?.data?.message || 'Lỗi khi thay đổi trạng thái lưu!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      console.error('Toggle save error:', err);
    }
  };

  const formatViews = (views) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (views >= 1_000) return (views / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return views.toString();
  };

  return (
    <div className="w-full h-60 p-2 bg-white rounded-md overflow-hidden mb-3 shadow-sm">
      <div className="relative w-full h-3/5 rounded-lg overflow-hidden group">
        <Link
          to={`/material/${material.id}`}
          className="block w-full h-full bg-gray-200 flex justify-center items-center"
        >
          <img
            src={material.thumbnail_path}
            alt="thumbnail"
            loading="lazy"
            className={`
              transition-all duration-300 
              ${material.file_type === FileType.PPT ? 'w-full' : 'h-full'} 
              group-hover:brightness-75
              group-hover:scale-105
            `}
          />
        </Link>

        {/* Bookmark button - bottom right corner */}
        <button
          onClick={handleSave}
          className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center cursor-pointer
                    bg-black/70 text-white border border-white rounded-full opacity-0 
                    group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110 shadow-sm"
        >
          <FaBookmark
            className={`text-sm ${isSaved ? 'text-yellow-400' : 'hover:text-yellow-400'} transition-colors duration-200`}
          />
        </button>
      </div>

      <div className="mt-2">
        <Link to={`/material/${material.id}`}>
          <p className="font-bold text-base line-clamp-2">{material.title}</p>
        </Link>
        <Link
          to={`/user/${material.user?.userId}`}
          className="hover:underline font-semibold text-[#00809D] text-xs"
        >
          <p>{material.user?.username || 'Ẩn danh'}</p>
        </Link>
        <p className="text-gray-600 text-xs">
          {material.total_pages || 0} slides · {formatViews(material.total_views || 0)} views
        </p>
      </div>
    </div>
  );
};

export default RecommendItem;