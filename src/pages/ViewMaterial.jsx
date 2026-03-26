import React from 'react';

const ViewMaterial = ({ fileId }) => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || 'https://api.documenthub.io.vn';
  const fileUrl = `${apiBase}/drive/view/${fileId}`;

  return (
    <div className="pdf-container" style={{ height: '90vh' }}>
      <iframe
        src={fileUrl}
        title="Google Drive PDF"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default ViewMaterial;
