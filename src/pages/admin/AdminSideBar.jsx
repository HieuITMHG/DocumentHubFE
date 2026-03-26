import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';


import { clearUserInfo } from "../../store/slices/userSlice";
import api from '../../utils/api'
import { useNavigate } from "react-router-dom";

const SideBarItem = ({ to, name }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-md ${isActive
          ? 'bg-sky-600 text-white'
          : 'hover:bg-gray-100 hover:text-black'}`}
      end
    >
      {name}
    </NavLink>
  )
}

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    if(! window.confirm("Bạn có chắc muốn đăng xuất ?"))
      return;
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("accessToken");
      dispatch(clearUserInfo());
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    }
  };
  return (
    <button
      className=' w-full  px-4 py-2 rounded-md text-left text-red-500  hover:bg-red-500 hover:text-white hover:font-bold'
      onClick={handleLogout}
    >
      Đăng xuất
    </button>

  );
}

const AdminSidebar = () => {
  const [hidden, setHidden] = useState(true);
  return (
    <div className={`bg-gray-700 text-white ${hidden ? 'w-15 px-0 py-4' : 'w-64 p-4'} h-screen flex flex-col`}>
      <div className='text-2xl block w-full text-center px-4 py-2 rounded-md flex items-center gap-2'>
        <button 
        className='  hover:bg-gray-100 hover:text-black p-1 rounded-md'
        onClick={() => { setHidden(!hidden) }}
      >
        ☰
      </button>
      {!hidden &&<div className='font-bold'>Menu</div>}
      </div>
      {true && 
          <ul className="space-y-2">
            <li><SideBarItem to="/admin" name={(hidden) ? "🏠" : "Trang chủ"} /></li>
            <li><SideBarItem to="/admin/reports" name={(hidden) ? "⚠️" :"Tố cáo từ người dùng"} /></li>
            <li><SideBarItem to="/admin/users" name={(hidden) ? "👤" :"Quản lý người dùng"} /></li>
            <li><SideBarItem to="/admin/categories" name={(hidden) ? "📑" :"Quản lý danh mục"} /></li>
            <li><SideBarItem to="/admin/statistics" name={(hidden) ? "📊" :"Thống kê dữ liệu"} /></li>
            <li><hr></hr></li>
            <li><LogoutButton /></li>
            <li><hr></hr></li>
          </ul> 
      }
    </div>
  )
}
export default AdminSidebar