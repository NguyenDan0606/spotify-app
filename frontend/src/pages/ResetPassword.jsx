import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function ResetPassword() {
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!otp || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ các trường");
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Mã OTP phải là 6 chữ số");
      return false;
    }
    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        setError("Không tìm thấy email. Vui lòng gửi OTP lại.");
        return;
      }

      const res = await api.post("/api/reset-password/", {
        email,
        otp,
        new_password: newPassword,
      });
      setMessage(res.data.message);
      localStorage.removeItem("resetEmail"); // ✅ Xóa email sau khi sử dụng
      setTimeout(() => navigate("/login"), 1000); // Chuyển hướng sau 1 giây
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi đặt lại mật khẩu, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="bg-zinc-900 p-10 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
            alt="Spotify"
            className="w-16 h-16 mb-2"
          />
          <h2 className="text-2xl font-bold">Đặt lại mật khẩu</h2>
        </div>

        <hr className="my-6 border-gray-700" />

        <form onSubmit={handleResetPassword} className="space-y-4">
          <label className="text-sm font-semibold block">Mã OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            placeholder="Nhập mã OTP"
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <label className="text-sm font-semibold block">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <label className="text-sm font-semibold block">Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-full font-bold transition ${
              isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 text-black hover:bg-green-400"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Quay lại trang đăng nhập{" "}
          <Link to="/login" className="text-white underline hover:text-green-400">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;