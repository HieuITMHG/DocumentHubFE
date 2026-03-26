import Footer from "../../components/Footer";
import AdminSidebar from "./AdminSideBar";
import { Outlet, useNavigate } from 'react-router-dom'
import api from "../../utils/api";
import { useEffect, useState } from "react";

const AdminLayout = ()=>{
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
        document.title = "Admin";
        const checkAuth = async ()=>{
            setIsLoading(true);
            try {
                await api.get("/api/admin/check-auth");
                setIsAuth(true);
            }catch (error){
                window.alert("Bạn không phải quản trị viên, không có quyền truy cập trang này!");
                setIsAuth(false);
                navigate("/");
            }
            finally{
                setIsLoading(false);
            }
        }

        checkAuth();
    },[])

    if (isLoading)
        return <div className="">Loading...</div>

    if (!isAuth)
        return <div>Bạn không phải quản trị viên, không thể  truy cập trang này</div>
    return (
        <div className="flex flex-col min-h-screen">
            {/* <div className="flex bg-sky-400">Chưa có header, khi nào có bỏ vào đây</div> */}

            <div className="flex flex-1">
                <AdminSidebar />
                <main className="flex-1 p-2">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    )
}
export default AdminLayout;