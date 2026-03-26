import React, { useState } from 'react';
import { FaDownload, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import EditMaterialModal from './EditMaterialModal';
import api from '../utils/api';

const MyUploadCard = ({ material, onEdit, onDelete, onVisibilityToggle }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Validate required fields
  if (!material || !material.id) {
    console.error('Invalid material data:', material);
    return null;
  }

  // Format date with fallback
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Get file type with fallback
  const getFileType = () => {
    return material.file_type || 'Unknown';
  };

  // Get page count with fallback
  const getPageCount = () => {
    return material.total_pages || 0;
  };

  // Get view count with fallback
  const getViewCount = () => {
    return material.total_views || 0;
  };

  // Get visibility status with fallback
  const getVisibility = () => {
    return material.visibility || 'PRIVATE';
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/documents/${material.id}`);
      onDelete(material.id);
    } catch (error) {
      console.error('Error deleting material:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setShowEditModal(true);
  };

  const handleEditSuccess = (updatedMaterial) => {
    onEdit(updatedMaterial);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Thumbnail */}
        <Link to={`/material/${material.id}`} className="block relative">
          <div className="aspect-[4/3] bg-gray-100">
            <img
              src={material.thumbnail_path || 'https://via.placeholder.com/300x225?text=No+Preview'}
              alt={material.title || 'Untitled Material'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x225?text=No+Preview';
              }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-semibold line-clamp-2">
              {material.title || 'Untitled Material'}
            </h3>
          </div>
        </Link>

        {/* Info and Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {formatDate(material.created_at)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              getVisibility() === 'PUBLIC' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {getVisibility()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FaEye className="mr-1" /> {getViewCount()}
              </span>
              <span>{getFileType()}</span>
            </div>
            <span>{getPageCount()} trang</span>
          </div>

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {material.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={handleEditClick}
                className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() =>
                  onVisibilityToggle(
                    material.id,
                    getVisibility() === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'
                  )
                }
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title={getVisibility() === 'PUBLIC' ? 'Make Private' : 'Make Public'}
              >
                {getVisibility() === 'PUBLIC' ? <FaEye /> : <FaEyeSlash />}
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                title="Delete"
                disabled={isDeleting}
              >
                <FaTrash />
              </button>
            </div>
            {material.original_file_path && (
              <a
                href={material.original_file_path}
                download
                className="p-2 text-green-500 hover:text-green-700 transition-colors"
                title="Download"
              >
                <FaDownload />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="mb-6">Bạn có chắc chắn muốn xóa tài liệu này?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      <EditMaterialModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        material={material}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default MyUploadCard; 