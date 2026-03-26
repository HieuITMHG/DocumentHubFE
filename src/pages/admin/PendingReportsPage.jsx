import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';


const ListItem = ({ data, onClick }) => {
    return (
        <div className='bg-white flex flex-row gap-4 shadow rounded-xl m-2 p-2'>
            <div className='border-1 border-sky-600 m-1'><img src={data.material_thumnail_url} alt="thumnail" className='h-25 w-25' /></div>

            <div className='rounded-xl flex flex-col p-5'>
                <div className='text-sky-600 font-bold'>{`Tiêu đề: ${data.material_title}`}</div>
                <div className=''>{`Id tài liệu: ${data.material_id}`}</div>
                <div className=''>{`Id chủ sở hữu: ${data.material_owner_id}`}</div>
                <div className='text-red-500 font-bold'>{`Số lượt bị tố cáo: ${data.reports.length}`}</div>
            </div>

            <div
                className='flex flex-row ml-auto p-5 items-center justify-center  rounded-xl'
                onClick={() => (onClick(data))}
            >
                <button className='px-5 py-2 rounded border-1 border-sky-500 text-sky-600 bg-white hover:font-bold hover:bg-sky-100'>
                    Chi tiết
                </button>
            </div>
        </div>
    )
}



const ReportsDetails = ({ data, onAction, onExit }) => {
    const [viewMaterial, setViewMaterial] = useState(false);
    const [isDeleteMaterial, setIsDeleteMaterial] = useState(false);
    const [isBanAccount, setIsBanAccount] = useState(false);
    return (
        <div className='flex flex-col gap-8 m-5  bg-white p-5 border-2  rounded-xl'>

            <div className='flex flex-row p-5 gap-4 text-center justify-center item-center'>
                <h2 className='text-3xl font-bold text-black'>Chi tiết báo cáo tài liệu</h2>
                <div className='text-center ml-auto'>
                    <button
                        className='text-center px-15 p-2 bg-white text-sky-600 border-1 border-sky-600 rounded hover:bg-sky-100 hover:font-bold'
                        onClick={onExit}>
                        Thoát
                    </button>
                </div>
            </div>
            <hr />


            <div className='flex flex-col gap-1 p-5 rounded shadow'>
                <h3 className='text-xl font-bold text-black'>Thông tin tài liệu</h3>

                <div className='font-bold text-gray-700'>Tiêu đề: <span className='font-normal text-black'>{data.material_title}</span></div>
                <div className='font-bold text-gray-700'>Id tài liệu: <span className='font-normal text-black'>{data.material_id}</span></div>
                <div className='font-bold text-gray-700'>Id người đăng: <span className='font-normal text-black'>{data.material_owner_id}</span></div>
                <div className='font-bold text-gray-700'>Số lượt bị tố cáo: <span className='font-bold text-red-600'>{data.reports.length}</span></div>
            </div>


            <div className='flex flex-col gap-1 p-5 text-center items-center  w-full'>
                <div>
                    <button
                        className='text-center px-15 p-2 bg-white text-sky-600 border-1 border-sky-600 rounded hover:bg-sky-100 hover:font-bold'
                        onClick={() => (setViewMaterial(!viewMaterial))}>
                        {`Click để ${(viewMaterial) ? "ẩn" : "xem"} tài liệu`}
                    </button>
                </div>
                {viewMaterial && <div className='p-5 w-full'>
                    <iframe className='w-full h-200 rounded-xl' src={data.material_pdf_url} ></iframe>
                </div>}
            </div>



            <div className='flex flex-col gap-4 w-full rounded-xl border-1 border-sky-700 p-5'>
                <h3 className='text-xl font-bold text-black'>Các báo cáo về tài liệu này:</h3>
                <div className='bg-gray-100 max-h-50 w-full overflow-auto p-5 rounded-xl shadow '>
                    {data.reports.map((r) => {
                        return (
                            <div className='shadow p-5 my-5 rounded-xl bg-white'>
                                {/* <div>{`Id report: ${r.report_id}`}</div>
                                <div>{`Id nguoi bao cao: ${r.reporter_id}`}</div>
                                <div>{`Vao luc: ${r.report_at}`}</div>
                                <div>{`Noi dung: ${r.report_content}`}</div> */}
                                <div className='italic text-gray-700'>{`Id báo cáo: ${r.report_id}`}</div>
                                <div className='italic text-gray-700'>{`Người dùng ${r.reporter_id} đã báo cáo tài liệu này`}</div>
                                <div className='italic text-gray-700'>{`Vào lúc: ${new Date(r.report_at).toLocaleString('vi-VN')}`}</div>
                                <div className='font-bold text-gray-700'>Nội dung:</div>
                                <div className=''>{`"${r.report_content}"`}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='flex flex-col gap-4 w-full border-1 border-red-500 rounded-xl p-5 bg-red-50'>
                <h3 className='text-xl font-bold text-black'>Hướng xử  lý</h3>

                <div>
                    <input
                        className='w-5 h-5 m-2'
                        type="checkbox"
                        checked={isDeleteMaterial}
                        onChange={() => setIsDeleteMaterial(!isDeleteMaterial)} />
                    <span className={`font-bold ${isDeleteMaterial ? "text-red-500 text-2xl" : "text-base"}`}>Xóa tài liệu</span>
                </div>

                <div >
                    <input
                        className='w-5 h-5 m-2'
                        type="checkbox"
                        checked={isBanAccount}
                        onChange={() => setIsBanAccount(!isBanAccount)} />
                    <span className={`font-bold ${isBanAccount ? "text-red-500 text-2xl" : "text-base"}`}>Khóa tài khoản người đăng tài liệu</span>
                </div>

                <div className='flex flex-col items-center justify-center p-1 m-1 text-center'>
                    <button
                        className='py-2 px-10 bg-red-500 text-white font-bold rounded hover:bg-red-400 hover:text-xl'
                        onClick={() => onAction({ data: data, isDeleteMaterial: isDeleteMaterial, isBanAccount: isBanAccount })}
                    >Xác nhận xử lý</button>
                </div>


            </div>

        </div>
    )
}

const PendingReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [currentReport, setCurrentReport] = useState(null);

    // loading
    const [isLoading, setIsLoading] = useState(true);


    // page
    const itemsPerPage = 5;
    const [maxPage, setMaxPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const handleNextPage = () => { if (currentPage < maxPage) setCurrentPage(currentPage + 1) };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("api/admin/reports/pending");

            setReports(response.data.data);
            // setReports(fakeData);
        }
        catch (error) {
            console.log(error);

        }
        setIsLoading(false);
    };

    useEffect(() => { fetchData() }, []);
    useEffect(() => {
        setMaxPage(Math.ceil(reports.length / itemsPerPage));
        setCurrentPage(1);
        setCurrentReport(null);
        console.log(JSON.stringify(reports, null, 4));
    }, [reports]);

    const handleReport = async ({ data, isDeleteMaterial, isBanAccount }) => {
        const confirmMessage =
            "Vui lòng xác nhận hành động:\n" +
            ((isDeleteMaterial) ? "Xóa tài liệu này\n" : "Không xóa tài liệu này\n") +
            ((isBanAccount) ? "Khóa tài khoản chủ sở hữu tài liệu" : "Không khóa tài khoản chủ sở hữu tài liệu");
        const confirm = window.confirm(confirmMessage);

        if (confirm) {
            try {
                const body = {
                    material_id: data.material_id,
                    owner_id: data.material_owner_id,
                    is_delete_material: isDeleteMaterial,
                    is_ban_account: isBanAccount
                };
                const response = await api.post("/api/admin/reports/handle", body);
                window.alert("Hoàn thành");
                fetchData();
            }
            catch (error) {
                const message = error?.response?.data?.message || "Lỗi không xác định";
                window.alert(message);
            }
        }
        setCurrentReport(null);
    }
    return (
        isLoading ? <>Loading...</>
            : (
                (currentReport != null) ?
                    <><ReportsDetails data={currentReport} onAction={handleReport} onExit={() => { (setCurrentReport(null)) }} /></>
                    : <div>
                        {/* <div>Code UI chưa kịp, coi đỡ JSON đi :)</div>
                        <pre className='w-9/10 overflow-auto'>{JSON.stringify(reports, null, 1)}</pre> */}
                        {/* <ListItem data={reports[0]} onClick={setCurrentReport} /> */}

                        {
                            reports.slice((currentPage - 1) * itemsPerPage, Math.min(currentPage * itemsPerPage, reports.length))
                                .map((r) => (
                                    <ListItem data={r} onClick={setCurrentReport} key={r.material_id} />
                                ))
                        }
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
            )

    )
}

export default PendingReportsPage;