import { MailCheck } from 'lucide-react'; // bạn có thể dùng biểu tượng khác nếu muốn

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <MailCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Xác thực Email</h1>
        <p className="text-gray-600 mb-4">
          Chúng tôi đã gửi một email xác thực đến địa chỉ bạn đã đăng ký.
        </p>
        <p className="text-gray-600 mb-6">
          Vui lòng kiểm tra hộp thư đến hoặc thư rác và nhấp vào liên kết trong email để hoàn tất quá trình đăng ký.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
