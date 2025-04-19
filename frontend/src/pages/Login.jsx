import { useState } from "react";
import api from "../api";
import { useNavigate,Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constans";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
      console.log("Login success:", res.data);
    } catch (error) {
      alert("Login failed. Please check credentials.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Login</h1>

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="User Name"
      />

      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button className="form-button" type="submit">Login</button>
      <p className="form-text">
        Bạn chưa có tài khoản?{" "}
        <Link to="/register" className="form-link">Đăng ký ngay</Link>
      </p>
    </form>
  );
}

export default Login;
