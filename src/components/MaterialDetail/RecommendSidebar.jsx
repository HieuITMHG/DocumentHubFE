import React, { useState, useEffect } from 'react';

import RecommendItem from './RecommendItem';
import { toast } from 'react-toastify';
import { getRelatedMaterials } from '../../apis/materialApis';

const RecommendSidebar = ({material_id}) => {
  const [recommendMaterial, setRecommendMaterial] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await getRelatedMaterials(material_id);
        setRecommendMaterial(response.materials || []);
      } catch (error) {
        console.error('Error fetching materials:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error('Không thể tải tài liệu gợi ý!', {
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

    fetchMaterials();
  }, [material_id]);

  return (
    <div className="w-full max-w-[320px] p-2 bg-white">
      <h3 className="text-xl font-bold mb-3 text-gray-800">Tài liệu liên quan</h3>
      {recommendMaterial.length > 0 ? (
        <div className="space-y-3">
          {recommendMaterial.map((material) => (
            <RecommendItem key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">Chưa có tài liệu gợi ý.</p>
      )}
    </div>
  );
};

export default RecommendSidebar;