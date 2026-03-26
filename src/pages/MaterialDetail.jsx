import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useSelector } from 'react-redux'; // Added useSelector
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import api from '../utils/api';
import Footer from '../components/Footer';
import RecommendSidebar from '../components/MaterialDetail/RecommendSidebar';
import Toolbar from '../components/MaterialDetail/Toolbar';
import { toggleSaveLater, toggleSaveList, getMyListWithStatus } from '../apis/materialApis';
import { normalizeDocumentDetailsToMaterial } from '../utils/normalize.js';

const MaterialDetail = () => {
  const { id: materialId } = useParams();
  const navigate = useNavigate(); // For redirecting to login
  const userInfo = useSelector((state) => state.user.userInfo); // Get user from Redux
  const [material, setMaterial] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [lists, setLists] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // State mới cho mô tả
  const [viewTimer, setViewTimer] = useState(null); // Timer để đếm thời gian xem

  useEffect(() => {
    // Bắt đầu timer 2 phút (120000ms) khi vào trang
    const timer = setTimeout(async () => {
      try {
        // OpenAPI không định nghĩa endpoint increment view.
        // bỏ qua để tránh lỗi 404
      } catch (error) {
        // no-op
      }
    }, 120000);

    setViewTimer(timer);

    // Cleanup timer khi component unmount hoặc materialId thay đổi
    return () => {
      if (viewTimer) {
        clearTimeout(viewTimer);
      }
    };
  }, [materialId]);

  // Xử lý khi user rời khỏi trang
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (viewTimer) {
        clearTimeout(viewTimer);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [viewTimer]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: () => null,
  });

  // Lấy thông tin Material
  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await api.get(`/api/documents/${materialId}`);
        const doc = res?.data?.data ?? res?.data;
        const normalized = normalizeDocumentDetailsToMaterial(doc);
        setMaterial(normalized);
        setPdfUrl(normalized.pdf_version_path);
        setIsSaved(normalized.is_saved || false);
        setIsLiked(normalized.is_liked || false);
        setDownloadUrl(normalized.original_file_path);
      } catch (err) {
        console.error('Lỗi khi tải tài liệu:', err);
        toast.error('Không thể tải tài liệu!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
    };
    fetchMaterial();
  }, [materialId]);

  // Lấy danh sách Lists với trạng thái material
  useEffect(() => {
    const getMyListWithMaterialStatus = async () => {
      try {
        const res = await getMyListWithStatus(materialId);
        setLists(res.lists || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách:', err);
      }
    };
    getMyListWithMaterialStatus();
  }, [materialId]);

  // Toggle lưu vào danh sách "Xem sau"
  const handleSave = async () => {
    const previousIsSaved = isSaved;
    setIsSaved(!isSaved);

    try {
      const response = await toggleSaveLater(materialId);
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

  // Toggle lưu vào danh sách cụ thể
  const handleToggleSaveToList = async (listId) => {
    try {
      const response = await toggleSaveList(materialId, listId);
      
      // Cập nhật trạng thái trong danh sách
      setLists(prevLists => 
        prevLists.map(list => 
          list.id === listId 
            ? { ...list, is_saved: response.saved }
            : list
        )
      );

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
      toast.error(err.response?.data?.message || 'Lỗi khi thay đổi trạng thái lưu!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      console.error('Toggle save to list error:', err);
    }
  };

  // Tạo danh sách mới và lưu tài liệu
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error('Vui lòng nhập tên danh sách!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      return;
    }

    try {
      // OpenAPI mapping:
      // - create collection: POST /api/collections { name }
      // - add document to collection: PUT /api/collections/{collection_id}/items/{document_id}
      const createRes = await api.post('/api/collections', { name: newListName });
      const createData = createRes?.data?.data ?? createRes?.data;
      const collectionId =
        createData?.id ?? createData?.collection_id ?? createData?.collectionId;

      if (!collectionId) throw new Error('Không lấy được collection_id từ response');

      await api.put(`/api/collections/${collectionId}/items/${materialId}`);

      toast.success('Đã tạo và lưu vào danh sách mới!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      setNewListName('');
      setIsCreateListModalOpen(false);
      
      // Cập nhật danh sách với trạng thái mới
      const res = await getMyListWithStatus(materialId);
      setLists(res.lists || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi tạo danh sách!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      console.error('Create list error:', err);
    }
  };

  const handleLike = async () => {
    const previousIsLiked = isLiked;
    setIsLiked(!isLiked);

    try {
      if (previousIsLiked) {
        await api.delete(`/api/documents/${materialId}/like`);
        setIsLiked(false);
      } else {
        await api.post(`/api/documents/${materialId}/like`);
        setIsLiked(true);
      }

      toast.success(previousIsLiked ? 'Đã bỏ thích' : 'Đã thích', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    } catch (err) {
      setIsLiked(previousIsLiked);
      toast.error(err.response?.data?.message || 'Lỗi khi thay đổi trạng thái thích!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      console.error('Toggle like error:', err);
    }
  };

  const handleDownload = async () => {
    try {
      if (userInfo) {
        window.open(downloadUrl, '_blank');
        toast.success('Đang tải xuống tài liệu!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      } else {
        navigate('/login', { replace: true });
        toast.info('Vui lòng đăng nhập để tải tài liệu!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      }
    } catch (err) {
      toast.error('Lỗi khi tải xuống tài liệu!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      console.error('Download error:', err);
    }
  };

  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async () => {
    if (!reportContent.trim()) {
      toast.error('Vui lòng nhập nội dung báo cáo!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      return;
    }

    try {
      // OpenAPI hiện không có endpoint report trong openapi.json.
      toast.error('Tính năng báo cáo chưa có trong FastAPI spec này.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      setReportContent('');
      setIsReportModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể gửi báo cáo!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      console.error('Report error:', err);
    }
  };

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
    setReportContent('');
  };

  // Format số lượt xem
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  if (!material) {
    return <p className="text-center mt-10 text-gray-800">Đang tải tài liệu...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Container chính với 2 cột */}
      <div className="flex flex-1 flex-col lg:flex-row w-full px-2 sm:px-4">
        {/* Cột trái: Tiêu đề, mô tả, Toolbar, PDF viewer */}
        <div className="flex-1 flex flex-col lg:pr-4">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 mt-4">{material.title}</h1>
          <div className="mb-4 text-gray-600 whitespace-normal">
            <p className={isDescriptionExpanded ? '' : 'line-clamp-2'}>
              {material.description || 'Không có mô tả.'}
            </p>
            {material.description && material.description.length > 100 && (
              <button
                className="text-blue-600 hover:underline text-sm mt-1"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
            <span>
              Đăng bởi{' '}
              <span className="font-semibold text-gray-700">
                {material.user.account?.username || 'Ẩn danh'}
              </span>
            </span>
            <span>•</span>
            <span>
              {material.created_at
                ? format(new Date(material.created_at), 'MMM dd, yyyy')
                : 'Jun 18, 2024'}
            </span>
            <span>•</span>
            <span>{material.total_likes || 0} lượt thích</span>
            <span>•</span>
            <span>{formatViews(material.total_views || 0)} lượt xem</span>
          </div>

          {/* Toolbar chỉ nằm trong cột tài liệu */}
          <div className="mb-4">
            <Toolbar
              onSave={handleSave}
              onLike={handleLike}
              onDownload={handleDownload}
              onReport={handleReport}
              isSaved={isSaved}
              isLiked={isLiked}
              lists={lists}
              onCreateList={() => setIsCreateListModalOpen(true)}
              onSaveToList={handleToggleSaveToList}
            />
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 border border-gray-200 rounded-md bg-white mb-4 overflow-hidden">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[defaultLayoutPluginInstance]}
                  defaultScale={1.2}
                  theme="light"
                />
              </div>
            </Worker>
          </div>
        </div>

        {/* Cột phải: RecommendSidebar */}
        <div className="lg:w-80 lg:min-w-[320px] lg:mt-4">
          <div className="sticky top-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            <RecommendSidebar material_id={materialId}/>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modal Báo cáo */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Báo cáo tài liệu</h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="5"
              placeholder="Nhập lý do báo cáo..."
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                onClick={handleReportSubmit}
              >
                Báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo danh sách mới */}
      {isCreateListModalOpen && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tạo danh sách mới</h2>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Nhập tên danh sách..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                onClick={() => {
                  setIsCreateListModalOpen(false);
                  setNewListName('');
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                onClick={handleCreateList}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialDetail;