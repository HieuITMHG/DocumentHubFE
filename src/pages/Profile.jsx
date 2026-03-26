import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setUserInfo } from '../store/slices/userSlice';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gọi API /api/users/info khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/api/users/me/profile');
        // OpenAPI: ResponseSuccessSchema_UserProfileResponse_ => { data: UserProfileResponse }
        dispatch(setUserInfo(response?.data?.data ?? response?.data));
      } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        toast.error('Không thể tải thông tin người dùng', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  // Cập nhật formData khi user thay đổi
  useEffect(() => {
    const fullName = user?.full_name || '';
    const parts = fullName ? fullName.split(' ').filter(Boolean) : [];
    const firstName = parts[0] || user?.first_name || '';
    const lastName = parts.slice(1).join(' ') || user?.last_name || '';
    setFormData({
      first_name: firstName,
      last_name: lastName,
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone_number || user?.phone || '',
      organization: user?.organization || '',
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();
      const payload = {
        full_name: fullName || formData.username,
        phone_number: formData.phone,
        bio: '', // openapi hỗ trợ nhưng UI hiện chưa có ô nhập
        gender: '', // openapi hỗ trợ nhưng UI hiện chưa có ô nhập
      };

      const response = await api.patch('/api/users/me/profile', payload);
      dispatch(setUserInfo(response?.data?.data ?? response?.data));
      toast.success('Cập nhật thông tin thành công', { position: 'top-right', autoClose: 3000 });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ các trường', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải dài ít nhất 6 ký tự', { position: 'top-right', autoClose: 3000 });
      return;
    }

    toast.error('FastAPI openapi.json hiện chưa có endpoint đổi mật khẩu kiểu oldPassword/newPassword. Vui lòng dùng luồng reset OTP.', {
      position: 'top-right',
      autoClose: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 pt-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-8">
            <h1 className="text-3xl font-bold">Quản lý thông tin cá nhân</h1>
            <p className="text-sm opacity-90 mt-1">Cập nhật và xem thông tin tài khoản của bạn</p>
          </div>

          {/* Content */}
          <form onSubmit={handleUpdateProfile} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Họ
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                  Tổ chức
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        first_name: user?.first_name || '',
                        last_name: user?.last_name || '',
                        username: user?.username || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        organization: user?.organization || '',
                      });
                    }}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  Chỉnh sửa
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup Đổi Mật Khẩu */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu cũ
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;