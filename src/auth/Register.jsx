import { useState } from "react";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    setSuccess("");
    try {
      await apiClient.post(
        "/Auth/register",
        { username, password },
        {
          skipAuth: true,
        }
      );
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(
        Object.values(err?.response?.data?.errors || {}).join(", ") || [
          "Registration failed. Please try a different username.",
        ]
      );
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-title">Register</h2>
      {error.length > 0 && (
        <div className="auth-error">
          {typeof error === "string" ? (
            <p>{error}</p>
          ) : (
            error?.map((err, index) => <p key={index}>{err}</p>)
          )}
        </div>
      )}
      {success && <div className="auth-success">{success}</div>}
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
        Register
      </button>
      <p className="auth-switch">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </form>
  );
}
