import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../apis/categoryApis';
import Footer from "../components/Footer"

const MaterialUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
        if (res.length > 0) {
          setCategory(res[0].id);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Vui lòng tải lên tệp PDF, Word hoặc PowerPoint hợp lệ.');
      setFile(null);
    }
  };

  const handleTagKeyDown = (e) => {
  if ((e.key === 'Enter' || e.key === ',') && tagInput.trim() !== '') {
    e.preventDefault();
    const newTag = tagInput.trim();

    if (tags.length >= 20) {
      setError('Chỉ được thêm tối đa 20 thẻ.');
      return;
    }

    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setError('');
    }
    setTagInput('');
  }
  };


  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError('Vui lòng nhập tiêu đề và chọn tệp.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    // FastAPI OpenAPI: DocumentUploadFormRequest expects `desc`
    formData.append('desc', description);
    formData.append('visibility', visibility);
    formData.append('category_id', category);
    tags.forEach((tag) => formData.append('tags', tag));

    try {
      setIsLoading(true);
        const response = await api.post('/api/documents', formData);
      setSuccess('Tải tài liệu thành công!');
      setError('');
      setTitle('');
      setDescription('');
      setFile(null);
      setVisibility('PUBLIC');
      setCategory(categories[0]?.id || '');
      setTags([]);
      setTagInput('');
    } catch (err) {
      console.error('Tải thất bại:', err);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Tải tài liệu thất bại.');
      }
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tải tài liệu lên</h1>

      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
      {success && <div className="mb-4 text-green-600 font-medium">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tiêu đề */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Nhập tiêu đề tài liệu"
            required
          />
        </div>

        {/* Mô tả */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Nhập mô tả tài liệu (nếu có)"
          />
        </div>

        {/* File */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Chọn tệp <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileChange} 
            className="w-full file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-md hover:file:bg-blue-700 cursor-pointer"
            required
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
            Quyền hiển thị
          </label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="PRIVATE">Riêng tư</option>
            <option value="PUBLIC">Công khai</option>
          </select>
        </div>

        {/* Danh mục */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categories.length === 0 ? (
              <option>Đang tải danh mục...</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Thẻ */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Thẻ (tags)
          </label>
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Nhấn Enter hoặc dấu phẩy để thêm thẻ"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-blue-500 hover:text-red-600 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-md text-white font-semibold transition duration-200 ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Đang tải lên...' : 'Tải tài liệu'}
        </button>
      </form>
      
    </div>
    <Footer />
    </>
  );
};

export default MaterialUpload;
