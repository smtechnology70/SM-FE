import { useState } from "react";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router";
import "./auth.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    setSuccess("");

    if (!passwordsMatch) {
      setError((prev) => [...prev, "Passwords do not match."]);
      return;
    }

    try {
      await apiClient.post(
        "/Auth/register",
        // { firstName, lastName, username, password },
        { username, password },
        { skipAuth: true }
      );
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        Object.values(err?.response?.data?.errors || {}).join(", ") || [
          "Registration failed. Please try a different username.",
        ]
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2 className="auth-title">Register</h2>
        {error && (
          <div className="auth-error">
            {typeof error === "string" ? (
              <p>{error}</p>
            ) : (
              error?.map((err, index) => <p key={index}>{err}</p>)
            )}
          </div>
        )}
        {success && <div className="auth-success">{success}</div>}

        <div className="auth-row">
          <input
            type="text"
            placeholder="First Name"
            className="auth-input half"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="auth-input half"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

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
        <input
          type="password"
          placeholder="Confirm Password"
          className="auth-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {confirmPassword && (
          <div
            className={`password-match ${
              passwordsMatch ? "match" : "no-match"
            }`}
          >
            {passwordsMatch
              ? "✅ Passwords match"
              : "❌ Passwords do not match"}
          </div>
        )}

        <button type="submit" className="auth-button">
          Register
        </button>
        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
