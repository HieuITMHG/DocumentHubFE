import { useState, useEffect } from 'react';
import api from '../../utils/api';
import CustomPieChart from './components/CustomPieChart';
import CustomBarChart from './components/CustomBarChart';
import { useNavigate } from "react-router-dom";
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF5",
  "#FF6699", "#33CCFF", "#66FF66", "#FF4444", "#9966FF",
  "#FF9933", "#0099CC", "#CCFF66", "#FFCC00", "#6699FF",
  "#FF6666", "#66CCCC", "#CC99FF"
];

const AdminStatisticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    setIsLoading(true);
    setLoadingMessage("Loading...");
    try {
      const response = await api.get("api/admin/statistics");
      setData(response.data.data);
    } catch (error) {
      const message = error?.response?.data?.message || "Lỗi không xác định";
      setLoadingMessage("Error: " + message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || !data) {
    return <div className='bg-sky-50 w-full h-full p-10 text-center text-xl'>{loadingMessage}</div>;
  }

  const topViewedMaterials = [...data.materials]
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, 10);

  const topLikedMaterials = [...data.materials]
    .sort((a, b) => b.total_likes - a.total_likes)
    .slice(0, 10);

  const topViewedCategories = [...data.categories]
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, 10);

  const topLikedCategories = [...data.categories]
    .sort((a, b) => b.total_likes - a.total_likes)
    .slice(0, 10);


  return (
    <div className='bg-sky-100 p-4 rounded-xl h-screen overflow-auto'>


      <h1 className="text-3xl font-bold text-center text-sky-900">Thống kê tài liệu và danh mục</h1>
      <h2 className="text-center text-sky-900 mb-5">(Dựa trên các tài liệu được đăng public)</h2>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className='bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2'>
          <h2 className="text-lg font-semibold mb-2 text-sky-600">Top 10 tài liệu được xem nhiều nhất</h2>
          <CustomBarChart
            data={topViewedMaterials} dataKeyValue='total_views' dataKeyLabel='material_title'
            tooltip={({ active, payload, label }) => {
              // console.log(JSON.stringify(payload, null, 4));
              if (!active) return null;
              if (!payload || payload.length === 0) return (<div>hehe</div>);
              const material = payload[0].payload;
              return (
                <div className='bg-gray-100 flex p-2 rounded-xl shadow gap-4'>
                  <div>
                    <img className='w-30 h-30' src={material.material_thumnail_path} alt="wtf" />
                    <div>Click để xem nội dung tài liệu</div>
                  </div>
                  <div>
                    <div className='text-sky-700 font-bold'>{label}</div>
                    <div>{`Số lượt xem: ${payload[0].value}`}</div>
                    <div>{`Người đăng: ${material.material_owner_name}`}</div>
                    <div>{`Đăng vào lúc: ${new Date(material.created_at).toLocaleString("vi-VN")}`}</div>
                  </div>

                </div>);
            }}
            onClick={(material) => { window.open(`/material/${material.material_id}`, "_blank") }}
          />
        </div>


        <div className='bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2'>
          <h2 className="text-lg font-semibold mb-2 text-sky-600">Top 10 tài liệu được thích nhiều nhất</h2>
          <CustomBarChart
            data={topLikedMaterials} dataKeyValue='total_likes' dataKeyLabel='material_title'
            tooltip={({ active, payload, label }) => {
              // console.log(JSON.stringify(payload, null, 4));
              if (!active) return null;
              if (!payload || payload.length === 0) return (<div>hehe</div>);
              const material = payload[0].payload;
              return (
                <div className='bg-gray-100 flex p-2 rounded-xl shadow gap-4'>
                  <div>
                    <img className='w-30 h-30' src={material.material_thumnail_path} alt="wtf" />
                    <div>Click để xem nội dung tài liệu</div>
                  </div>
                  <div>
                    <div className='text-sky-700 font-bold'>{label}</div>
                    <div>{`Số lượt thích: ${payload[0].value}`}</div>
                    <div>{`Người đăng: ${material.material_owner_name}`}</div>
                    <div>{`Đăng vào lúc: ${new Date(material.created_at).toLocaleString("vi-VN")}`}</div>

                  </div>

                </div>);
            }}
            onClick={(material) => { window.open(`/material/${material.material_id}`, "_blank") }}
          />
        </div>


        <div className='bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2'>
          <h2 className="text-lg font-semibold mb-2 text-sky-600">Top 10 danh mục được xem nhiều nhất</h2>
          <CustomBarChart data={topViewedCategories} dataKeyValue='total_views' dataKeyLabel='name'
            tooltip={({ active, payload }) => {
              if (!active) return null;
              if (!payload || payload.length == 0) return null;
              const category = payload[0].payload;
              return (
                <div className='bg-gray-100 flex flex-col gap-4 p-2 shadow  rounded-xl'>
                  <div className='text-sky-600 font-bold'>{category.name}</div>
                  <div>{`Tổng số lượt xem: ${category.total_views}`}</div>
                </div>
              );
            }}
          />
        </div>


        <div className='bg-white p-4 rounded-xl shadow col-span-1 md:col-span-2'>
          <h2 className="text-lg font-semibold mb-2 text-sky-600">Top 10 danh mục được thích nhiều nhất</h2>
          <CustomBarChart data={topLikedCategories} dataKeyValue='total_likes' dataKeyLabel='name'

            tooltip={({ active, payload }) => {
              if (!active) return null;
              if (!payload || payload.length == 0) return null;
              const category = payload[0].payload;
              return (
                <div className='bg-gray-100 flex flex-col gap-4 p-2 shadow  rounded-xl'>
                  <div className='text-sky-600 font-bold'>{category.name}</div>
                  <div>{`Tổng số lượt thích: ${category.total_likes}`}</div>
                </div>
              );
            }}

          />
        </div>


        <div className='bg-white p-4 rounded-xl shadow'>
          <h2 className="text-lg font-semibold mb-2 text-sky-600">Tài liệu theo danh mục</h2>
          <CustomPieChart data={data.categories} dataKey='total_materials' nameKey='name' color={COLORS} innerRadius={40}
            tooltip={({ active, payload }) => {
              if (!active) return null;
              if (!payload || payload.length == 0) return null;
              const category = payload[0].payload;
              return (
                <div className='bg-gray-100 flex flex-col p-2 rounded-xl shadow gap-4'>
                  <div className='text-sky-600 font-bold text-lg'>{`${payload[0].name}`}</div>
                  <div>{`Số tài liệu: ${category.total_materials}`}</div>
                  <div>{`Tỷ lệ: ${Math.round((category.total_materials / data.materials.length) * 10000) / 100}%`}</div>
                  <div className='text-sm text-gray-500'>{`Số lượt xem: ${category.total_views}`}</div>
                  <div className='text-sm text-gray-500'>{`Số lượt thích: ${category.total_likes}`}</div>
                </div>
              );
            }} />
        </div>


        <div className='bg-white p-4 rounded-xl shadow'>
          <h2 className="text-lg font-semibold mb-2 text-sky-600">Tài liệu theo định dạng</h2>
          <CustomPieChart data={data.filetypes} dataKey='total_materials' nameKey='name' color={COLORS} innerRadius={40}
            tooltip={({ active, payload }) => {
              if (!active) return null;
              if (!payload || payload.length == 0) return null;
              const type = payload[0].payload;
              return (
                <div className='bg-gray-100 flex flex-col p-2 rounded-xl shadow gap-4'>
                  <div className='text-sky-600 font-bold text-lg'>{`${payload[0].name}`}</div>
                  <div>{`Số tài liệu: ${type.total_materials}`}</div>
                  <div>{`Tý lệ: ${Math.round((type.total_materials / data.materials.length) * 10000) / 100}%`}</div>
                  <div className='text-sm text-gray-500'>{`Số lượt xem: ${type.total_views}`}</div>
                  <div className='text-sm text-gray-500'>{`Số lượt thích: ${type.total_likes}`}</div>
                </div>
              );
            }}
          />
        </div>


      </div>
    </div>
  );
};

export default AdminStatisticsPage;
