import React, { useState, useEffect } from 'react';

const Toolbar = ({ onSave, onLike, onDownload, onReport, isSaved, isLiked, lists, onCreateList, onSaveToList }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let closeTimeout = null;

  // Mở dropdown
  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    setIsDropdownOpen(true);
  };

  // Đóng dropdown với độ trễ
  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Độ trễ 200ms
  };

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, []);

  // Xử lý click vào list item
  const handleListClick = async (e, listId) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onSaveToList(listId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
      <div className="space-x-4">
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          📥 Tải xuống
        </button>
        <button
          onClick={onReport}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          ⚠️ Báo cáo
        </button>
      </div>
      <div className="space-x-4">
        <div
          className="relative inline-block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={onSave}
            className={`px-4 py-2 border border-blue-600 rounded-md transition-colors duration-200 ${
              isSaved
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-transparent text-blue-600 hover:bg-blue-100'
            }`}
            aria-label={isSaved ? 'Bỏ lưu tài liệu' : 'Lưu tài liệu'}
          >
            💾 Lưu
          </button>
          {isDropdownOpen && (
            <div
              className="absolute z-20 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg right-0 transition-opacity duration-200"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateList();
                    setIsDropdownOpen(false);
                  }}
                  aria-label="Tạo danh sách mới"
                >
                  + Tạo danh sách mới
                </button>
                {lists.length > 0 ? (
                  lists.map((list) => (
                    <button
                      key={list.id}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={(e) => handleListClick(e, list.id)}
                      disabled={isLoading}
                      aria-label={`${list.is_saved ? 'Bỏ lưu khỏi' : 'Lưu vào'} danh sách ${list.list_name}`}
                    >
                      <span>{list.list_name}</span>
                      <span className="ml-2">
                        {list.is_saved ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-500">+</span>
                        )}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">Chưa có danh sách</div>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onLike}
          className={`px-4 py-2 border border-red-600 rounded-md transition-colors duration-200 ${
            isLiked
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-transparent text-red-600 hover:bg-red-100'
          }`}
          aria-label={isLiked ? 'Bỏ thích tài liệu' : 'Thích tài liệu'}
        >
          ❤️ Thích
        </button>
      </div>
    </div>
  );
};

export default Toolbar;