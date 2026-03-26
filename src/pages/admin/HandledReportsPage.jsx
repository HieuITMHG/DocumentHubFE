import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';

// {
//     "report_id": "684fd7cd0d0005f84c30d31",
//     "material_id": "684f98769e7f9898a1740c2c",
//     "material_title": "Văn học 1",
//     "owner_id": "684f88d39d579b3818ef0fbf",
//     "report_content": "Thích thì tố",
//     "admin_id": "684f8c2aeac03d443eb5099a",
//     "is_delete_material": false,
//     "is_ban_account": false,
//     "report_at": "2025-06-16T08:37:33.335Z",
//     "handle_at": "2025-06-16T15:07:40.822Z"
// }
const ListItem = ({ data }) => {

    const [displayFullContent, setDisplayFullContent] = useState(false);
    const maxDisplayChar = 10;
    const full_content = data.report_content;
    const short_content = full_content.split(" ").slice(0, maxDisplayChar).join(" ");

    return (
        <div className='grid grid-cols-3 gap-4 p-3 m-3 rounded shadow bg-white'>

            <div className='flex flex-col p-4 rounded shadow bg-white'>
                <div className='text-black font-bold'>Thông tin về báo cáo</div>
                <div>{`Id: ${data.report_id}`}</div>
                <div>Nội dung tố  cáo:</div>

                <div className='bg-gray-100 text-red-500 italic pl-2  rounded shadow'>
                    {(displayFullContent) ? (full_content) : (short_content)}

                    {(full_content != short_content) && <span
                        className='pl-1 text-sm text-blue-500 cursor-pointer'
                        onClick={() => { setDisplayFullContent(!displayFullContent) }}
                    >{displayFullContent ? "ẩn bớt" : "...chi tiết"}</span>}
                </div>

                <div>{`Gởi lúc: ${new Date(data.report_at).toLocaleString('vi-VN')}`}</div>
                <div>{`Xử lý lúc: ${new Date(data.handle_at).toLocaleString('vi-VN')}`}</div>
            </div>

            <div className='flex flex-col p-4 rounded shadow bg-white'>
                <div className='text-black font-bold'>Thông tin về tài liệu</div>
                <div className={data.material_id ? "" : "text-red-500 font-bold"}>
                    {data.material_id
                        ? `ID Tài liệu: ${data.material_id}`
                        : "Tài liệu đã bị xóa"}
                </div>
                <div>
                    {data.material_title
                        ? `Tài liệu: ${data.material_title}`
                        : ""}
                </div>

                <div>
                    {data.material_owner_id
                        ? `Chủ sở hữu: ${data.material_owner_id}`
                        : ""}
                </div>
            </div>

            <div className='flex flex-col p-4 rounded shadow bg-white'>
                <div className='text-black font-bold'>Kết quả</div>
                <div className='italic'>{`Xử  lý bởi admin: ${data.admin_id}`}</div>
                <div className={data.is_delete_material ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                    {data.is_delete_material ? "Xóa tài liệu" : "Không xóa tài liệu"}
                </div>
                <div className={data.is_ban_account ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                    {data.is_ban_account ? "Khóa tài khoản" : "Không khóa tài khoản"}
                </div>
            </div>

        </div>
    );
};

const ReportDetails = ({ data, onClose }) => {
    return
    (<div>

    </div>);
}
const HandledReportsPage = () => {
    const [reports, setReports] = useState([]);

    // loading
    const [isLoading, setIsLoading] = useState(true);


    // page
    const itemsPerPage = 3;
    const [maxPage, setMaxPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const handleNextPage = () => { if (currentPage < maxPage) setCurrentPage(currentPage + 1) };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("api/admin/reports/handled");
            const data = response.data.data;

            data.sort((a, b) => (new Date(b.handle_at) - new Date(a.handle_at)));
            setReports(data);
        }
        catch (error) {
            const message = error?.response?.data?.message || "Lỗi không xác định";
            console.log(message);
        }
        setIsLoading(false);
    };

    useEffect(() => { fetchData() }, []);
    useEffect(() => {
        setMaxPage(Math.ceil(reports.length / itemsPerPage));
        setCurrentPage(1);
    }, [reports]);

    if (isLoading)
        return <div>Loading...</div>

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min((currentPage * itemsPerPage), reports.length);
    return (
        <div>
            <div>
                {reports.slice(startIndex, endIndex).map((element, index) => (
                    <ListItem data={element} key={index} />
                ))}
            </div>

            <div className="m-auto grid grid-cols-3 gap-4 items-center text-center justify-center w-1/2 p-4">
                <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-gray-500"
                    disabled={currentPage == 1}
                    onClick={handlePrevPage}
                >
                    Trang trước
                </button>

                <div className="text-gray-700 font-medium  h-full text-center font-bold text-xl">{`${currentPage} / ${maxPage}`}</div>

                <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-gray-500"
                    disabled={currentPage == maxPage}
                    onClick={handleNextPage}
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
};

export default HandledReportsPage;