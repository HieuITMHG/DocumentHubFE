import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../utils/api';
const StatItem = ({ name, value }) => {
    return (
        <div className="bg-white rounded-lg shadow h-30 p-4 text-center hover:bg-sky-100">
            <p className="text-sky-700 text-xl font-bold">{name}</p>
            <p className="text-xl ">{value}</p>
        </div>
    );
};

const QUICKACTION = [
    { name: "Xử lý báo cáo", link: "/admin/reports" },
    { name: "Quản lý tài khoản", link: "/admin/users" },
    { name: "Quản lý danh mục", link: "/admin/categories" },
    { name: "Thống kê", link: "/admin/statistics" }

]
const QuickAction = ({ name, link, icon }) => {
    return (
        <Link to={link}>
            <div className='bg-sky-300 text-gray-900 font-bold py-2 px-5 m-5 rounded shadow hover:text-white  hover:bg-sky-700'>{name}</div>
        </Link>
    )
}




const AdminDashboard = () => {
    console.log("token:", localStorage.getItem('accessToken'));
    const [statisticsData, setStatisticsData] = useState();
    const [isLoading, setIsLoading] = useState(true)


    const fetchData = async () => {
        setIsLoading(true);
        try{
            const response = await api.get("/api/admin/overview");
            setStatisticsData(response.data.data);
            console.log(JSON.stringify(response.data.data, null, 4))
        }catch(error){
            const message = error?.response?.data?.message || "Lỗi không xác định";
            window.alert(message)
            console.log("Fetch data error: ", message);
        }finally{
            setIsLoading(false);
        }        
    };


    useEffect(() => {
        fetchData();
    }
        , [])

    if (isLoading)
        return <div>Loading...</div>
    return (
        <div className="p-6 bg-sky-50 w-full h-full rounded-xl">
            <h1 className="text-3xl text-sky-900 font-bold text-center mb-5">Trang chủ </h1>


            <div className='bg-gray-50 rounded-xl shadow p-3 m-3' >
                <div className='text-xl font-bold'>Tổng quan hệ thống</div>
                <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4 m-2 p-2">
                    {statisticsData.map((element, index) => (
                        <StatItem key={index} name={element?.name || "something wrong"}value={element?.value != null ? element.value : "something"} />
                    ))}
                </div>
            </div>

            <div className='bg-gray-50 rounded-xl shadow p-3 m-3'>
                <div className='text-xl font-bold'>Truy cập nhanh các chức năng</div>
                <div className='flex flex-rows gap-4 items-center justify-center' >
                    {QUICKACTION.map((element, index) => (
                        <QuickAction name={element.name} link={element.link} key={index} />
                    ))}
                </div>
            </div>


        </div>
    );
};

export default AdminDashboard;