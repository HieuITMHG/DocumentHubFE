import { useState } from 'react';
import PendingReportsPage from './PendingReportsPage';
import HandledReportsPage from './HandledReportsPage';

const AdminReportsManagementPage = () => {
    const [viewPendingReports, setViewPendingReports] = useState(true);
    return (
        <div className="bg-sky-50 w-full h-full p-4 rounded-xl">
            <h1 className="text-3xl text-sky-900 text-center font-bold mb-2">Báo cáo tài liệu vi phạm từ người dùng</h1>

            {/* Tab toggle */}
            <div className='w-1/4 flex flex-row gap-1 text-center text-base'>

                <div className={`w-1/2 cursor-pointer ${(viewPendingReports
                    ? "text-sky-700 font-bold"
                    : "text-gray-600 hover:text-sky-500 hover:font-bold")}`}
                    onClick={() => setViewPendingReports(true)}>
                    <div className='p-1'>Chưa xử lý</div>
                    {viewPendingReports && <hr className='border-sky-500 border-1' />}
                </div>

                <div className={`w-1/2 cursor-pointer ${(!viewPendingReports
                    ? "text-sky-700 font-bold"
                    : "text-gray-600 hover:text-sky-500 hover:font-bold")}`}
                    onClick={() => setViewPendingReports(false)}
                >
                    <div className='p-1'>Đã xử lý</div>
                    {!viewPendingReports && <hr className='border-sky-500 border-1' />}
                </div>
            </div>

            <hr className="border-gray-300 border-1" />

            {/* Page */}
            {(viewPendingReports) ? <PendingReportsPage /> : <HandledReportsPage />}
        </div>
    );
}

export default AdminReportsManagementPage;