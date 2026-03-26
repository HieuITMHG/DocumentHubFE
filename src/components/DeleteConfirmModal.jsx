import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ open, onClose, onConfirm, title }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Xác nhận xóa</h2>
        </div>
        <div className="modal-body">
          <p>Bạn có chắc chắn muốn xóa tài liệu "{title}"? Hành động này sẽ:</p>
          <ul>
            <li>Xóa tất cả likes của tài liệu</li>
            <li>Xóa tài liệu khỏi tất cả các danh sách</li>
            <li>Xóa tất cả tags của tài liệu</li>
          </ul>
          <p className="warning-text">Hành động này không thể hoàn tác!</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-delete" onClick={onConfirm}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 