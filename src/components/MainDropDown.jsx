import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../store/slices/userSlice";
import { useState, useEffect, useRef } from "react";
import defaultAvatar from "@imgs/defaultAvatar.png";
import api from "../utils/api";
import {
  UserIcon,
  BookmarkIcon,
  ArrowUpTrayIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const MainDropDown = () => {
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropDown = () => {
    setIsOpen((prev) => !prev);
  };

  const goToSaved = () => {
    window.location.href = "/saved";
  };

  const goToProfile = () => {
    window.location.href = "/profile";
  };

  const goToMyUpload = () => {
    window.location.href = "/my-uploads";
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("accessToken");
      dispatch(clearUserInfo());
      window.location.href = "/login";
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    }
  };

  return (
    <div className="relative z-[1000]" ref={dropdownRef}>
      <button
        onClick={handleToggleDropDown}
        className="flex items-center focus:outline-none"
        aria-label="Toggle user menu"
      >
        <img
          src={user?.avatar || defaultAvatar}
          alt="User Avatar"
          className="h-12 w-12 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-colors duration-200"
        />
      </button>

      {isOpen && (
        <div
          id="main-drop-down"
          className="absolute top-14 right-0 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-[1000] transition-all duration-200 ease-in-out transform origin-top-right scale-100"
        >
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800 truncate">
              Hello, {user?.username || "User"}
            </p>
          </div>
          <ul className="py-2">
            <li
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150"
              onClick={goToProfile}
            >
              <UserIcon className="h-5 w-5 mr-3" />
              Hồ sơ
            </li>
            <li
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150"
              onClick={goToSaved}
            >
              <BookmarkIcon className="h-5 w-5 mr-3" />
              Đã lưu
            </li>
            <li
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150"
              onClick={goToMyUpload}
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-3" />
              Tài liệu của tôi
            </li>
            <li
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors duration-150"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              Đăng xuất
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainDropDown;
