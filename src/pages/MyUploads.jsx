import { useEffect, useState } from 'react';
import { getUserUploadedMaterials, deleteMaterial, updateMaterial, toggleMaterialVisibility } from '../apis/materialApis';
import MyUploadCard from '../components/MyUploadCard';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyUploads = () => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const data = await getUserUploadedMaterials();
      setMaterials(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials');
      setMaterials([]);
      toast.error('Failed to load your uploaded materials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisibilityToggle = async (materialId, visibility) => {
    try {
      await toggleMaterialVisibility(materialId, visibility);
      // Refresh materials list
      await fetchMaterials();
      toast.success('Visibility updated successfully');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const handleDelete = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteMaterial(materialId);
        // Remove the deleted material from the list
        setMaterials(materials.filter(m => m.id !== materialId));
        toast.success('Material deleted successfully');
      } catch (error) {
        console.error('Error deleting material:', error);
        toast.error('Failed to delete material');
      }
    }
  };

  const handleEdit = async (updatedMaterial) => {
    try {
      // Fetch fresh data from server
      const data = await getUserUploadedMaterials();
      setMaterials(Array.isArray(data) ? data : []);
      toast.success('Cập nhật tài liệu thành công!');
    } catch (error) {
      console.error('Error refreshing materials:', error);
      toast.error('Cập nhật thành công nhưng không thể tải lại dữ liệu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tài liệu của tôi</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Tổng: {materials.length} tài liệu</span>
            </div>
          </div>
          
          {!materials || materials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Bạn chưa đăng tải tài liệu nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {materials.map((material) => (
                <MyUploadCard
                  key={material.id}
                  material={material}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onVisibilityToggle={handleVisibilityToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyUploads; 