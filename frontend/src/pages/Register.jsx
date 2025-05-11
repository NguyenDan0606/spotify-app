import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return minLength && hasLetter && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Kiểm tra các trường không được bỏ trống
    if (!username || !password || !confirmPassword || !email || !last_name) {
      setError("❌ Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("❌ Mật khẩu và xác nhận không trùng khớp.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError("❌ Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số.");
      return;
    }

    try {
      const res = await api.post(
        "/api/user/register/",
        { username, password, email, last_name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccessMessage("✅ Đăng ký thành công!");
        setTimeout(() => navigate("/login"), 1000); // Chuyển hướng sau 1 giây
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.username) {
          setError(`❌ ${data.username.join(" ")}`);
        } else if (data.email) {
          setError(`❌ ${data.email.join(" ")}`);
        } else if (data.detail) {
          setError(`❌ ${data.detail}`);
        } else {
          setError("❌ Đăng ký thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("❌ Đăng ký thất bại. Vui lòng kiểm tra kết nối.");
      }
      console.error("Đăng ký lỗi:", error);
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
          <h2 className="text-2xl font-bold">Đăng ký tài khoản Spotify</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block">Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên người dùng"
              className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block">Họ và tên</label>
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Họ và tên"
              className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold block">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Hiển thị thông báo lỗi */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Hiển thị thông báo thành công */}
          {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-green-500 text-black py-2 rounded-full font-bold hover:bg-green-400 transition"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-white underline hover:text-green-400">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;