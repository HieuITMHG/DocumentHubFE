import { useState, useEffect } from 'react'
import api from '../../utils/api';

const CategorisItem = ({ category, onAction }) => {
    return (
        <div className='grid grid-cols-3 gap-4 shadow text-center p-1 m-1 bg-white rounded' >
            <div>{category.id}</div>
            <div>{category.name}</div>
            <div className="flex justify-center items-center">
                <button
                    className="bg-white text-sky-600 border border-sky-600 hover:bg-sky-100 hover:font-bold rounded w-1/2 p-1"
                    onClick={() => onAction(category)}
                >
                    Đổi tên
                </button>
            </div>
        </div>
    );
}

const AdminCategoriesManagementPage = () => {
    const [categories, setCategories] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 10;
    const [maxPage, setMaxPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handleNextPage = () => { if (currentPage < maxPage) { setCurrentPage(currentPage + 1) } };
    const handlePrevPage = () => { if (currentPage > 1) { setCurrentPage(currentPage - 1) } };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("api/admin/categories");
            console.log(JSON.stringify(response.data.data, null, 4));
            setCategories(response.data.data);

        } catch (error) {
            const message = error?.response?.data?.message || "Lỗi không xác định";
            console.log(message);
        }
        setIsLoading(false);
    }

    const addNewCategory = async () => {
        const name = window.prompt("Nhap ten moi");
        if (name != null && name.trim() != "") {
            const confirm = window.confirm(`Bạn có chắc muốn thêm danh mục mới "${name}" không?`);
            if (confirm) {
                try {
                    const response = await api.post("api/admin/categories/new", { name: name });
                    window.alert("Thanh cong!");
                    await fetchData();
                } catch (error) {
                    const message = error?.response?.data?.message || error.message || "Lỗi không xác định";
                    window.alert("Có lỗi xảy ra: " + message);
                }
            }

        }
    }

    const renameCategory = async (category) => {
        const confirm = window.confirm(`Bạn có muốn đổi tên danh mục '${category.name}' ?`);
        if (!confirm)
            return;

        const name = window.prompt("Nhập tên mới");
        if (!name || name.trim() == "") {
            return;
        }

        try {
            const response = await api.post("api/admin/categories/rename", { id: category.id, new_name: name });
            window.alert("Thanh cong!");
            await fetchData();
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Lỗi không xác định";
            window.alert("Có lỗi xảy ra: " + message);
        }

    }

    useEffect(() => { fetchData(); }, [])

    useEffect(() => {
        setMaxPage(Math.ceil(categories.length / itemsPerPage));
        setCurrentPage(1);
    }, [categories])

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min((currentPage) * itemsPerPage, categories.length);
    return (
        isLoading ? <div>Đang tải dữ liệu</div>
            :
            <div className="bg-sky-50 w-full h-full p-4 rounded-xl">
                <h1 className="text-3xl font-bold text-center text-sky-900 mb-2">Danh mục tài liệu</h1>


                <button className="p-2 px-4 mx-4 my-2 bg-white text-sky-600 font-bold border border-sky-500 rounded shadow hover:bg-sky-100"
                    onClick={addNewCategory}
                >+ Thêm danh mục mới</button>

                {/* Categories list */}
                <div className="flex flex-col mx-4 my-2 pb-2  bg-white rounded-xl">

                    <div className='grid grid-cols-3 gap-4 shadow rounded-t-xl h-10 text-center p-2 font-bold bg-sky-300' >
                        <div>Mã danh mục</div>
                        <div>Tên danh mục</div>
                        <div>Hành động</div>
                    </div>

                    {categories.slice(startIndex, endIndex).map((item) =>
                        (<CategorisItem category={item} onAction={renameCategory} key={item.id} />)
                    )}
                </div>

                {/* page */}
                <div className="grid grid-cols-3 gap-4 text-center w-1/2 p-4 mx-auto">
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
}

export default AdminCategoriesManagementPage;