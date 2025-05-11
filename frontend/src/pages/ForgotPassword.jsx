import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/api/forgot-password/", { email });
      setMessage(res.data.message);
      localStorage.setItem("resetEmail", email); // ✅ Lưu email vào localStorage
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi gửi OTP, vui lòng thử lại");
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
          <h2 className="text-2xl font-bold">Quên mật khẩu</h2>
        </div>

        <hr className="my-6 border-gray-700" />

        <form onSubmit={handleSendOTP} className="space-y-4">
          <label className="text-sm font-semibold block">Nhập Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
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
            {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
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

export default ForgotPassword;