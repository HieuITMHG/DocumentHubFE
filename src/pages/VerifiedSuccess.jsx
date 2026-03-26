import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../store/slices/userSlice";

const VerifiedSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        const errMsg = "Token không hợp lệ";
        setStatus("error");
        setMessage(errMsg);
        toast.error(errMsg, { position: "top-center", toastId: "verify-error" });
        return;
      }

      try {
        const response = await api.get(`/api/users/verify-email?token=${token}`);
        console.log("✅ Status:", response.status);

        if (response.status === 200) {
          const successMsg = response.data.message;
          setStatus("success");
          setMessage(successMsg);

          dispatch(setUserInfo(response.data.user));

          toast.success(successMsg, {
            position: "top-center",
            toastId: "verify-success",
          });

          setTimeout(() => navigate("/"), 3000);
        } else {
          throw new Error("Xác nhận không thành công");
        }
      } catch (error) {
        const errMsg = error.response?.data?.message || "Xác nhận email thất bại";
        setStatus("error");
        setMessage(errMsg);
        toast.error(errMsg, {
          position: "top-center",
          toastId: "verify-error",
        });
      }
    };

    verifyEmail();
  }, []); 

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-96 text-center">
        {status === "loading" && (
          <div>
            <ClipLoader color="#00809D" size={50} />
            <p className="text-gray-700 mt-4">Đang xác nhận email...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Xác nhận thành công!</h2>
            <p className="text-gray-700">{message}</p>
            <p className="text-gray-700 mt-2">
              Bạn sẽ được chuyển hướng đến trang chính trong giây lát...
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-[#00809D] text-white p-2 rounded"
            >
              Đi đến trang chính
            </button>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Xác nhận thất bại</h2>
            <p className="text-gray-700">{message}</p>
            <p className="text-gray-700 mt-2">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-[#00809D] text-white p-2 rounded"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
      <ToastContainer limit={1} />
    </div>
  );
};

export default VerifiedSuccess;
