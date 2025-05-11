import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constans";
import { useUser } from "../context/UserContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [, setUser, fetchUser] = useUser(); // ✅ thêm fetchUser

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/token/", { username, password });
      const { access, refresh } = res.data;
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      const profileRes = await api.get("/api/profile/");
      const userData = profileRes.data;

      setUser(userData);         // ✅ cập nhật context
      fetchUser();               // ✅ gọi lại fetchUser() để đảm bảo đầy đủ avatar, email...

      localStorage.setItem("avatar", userData.avatar || "");
      localStorage.setItem("username", userData.username || "");

      navigate("/");
    } catch (error) {
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="bg-zinc-900 p-10 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify" className="w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold">Đăng nhập vào Spotify</h2>
        </div>

        <hr className="my-6 border-gray-700" />

        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="text-sm font-semibold block">Email hoặc tên người dùng</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email hoặc tên người dùng"
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <label className="text-sm font-semibold block">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <p className="text-sm text-gray-400 mt-6">
            <Link to="/forgot-password" className="text-white underline hover:text-green-400">
              Quên mật khẩu
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-green-500 text-black py-2 rounded-full font-bold hover:bg-green-400 transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="text-white underline hover:text-green-400">
            Đăng ký Spotify
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
