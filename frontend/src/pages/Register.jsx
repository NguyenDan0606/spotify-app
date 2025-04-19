import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/user/register/", {
        username,
        password,
        email,
        first_name,
        last_name,
      });

      if (res.status === 201 || res.status === 200) {
        navigate("/login");
        console.log("Register success:", res.data);
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Register</h1>

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />

      <input
        className="form-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        className="form-input"
        type="text"
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />

      <input
        className="form-input"
        type="text"
        value={last_name}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />

      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button className="form-button" type="submit">Register</button>
    </form>
  );
}

export default Register;
