import { useState } from "react";
import apiClient from "../utils/apiClient";
import { setTokens } from "./tokenService";
import "./auth.css";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiClient.post(
        "/Auth/login",
        { username, password },
        {
          skipAuth: true,
        }
      );
      setTokens(res.data);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2 className="auth-title">Login</h2>
        {error && <div className="auth-error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">
          Login
        </button>
        <p className="auth-switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}
