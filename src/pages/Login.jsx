import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const { user, login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="container">
      <div
        className="form-container"
        style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}
      >
        <h2 className="heading" style={{ textAlign: "center" }}>
          Login to Meal Planner Pro
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Email:
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form-label">
            Password:
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          {error && (
            <p style={{ color: "var(--color-danger)", marginTop: "0.5rem" }}>
              {error}
            </p>
          )}
        </form>

        <p style={{ marginTop: "1rem" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--color-primary)" }}>
            Register
          </Link>
        </p>
        <p style={{ marginTop: "1rem" }}>
          To see the app in action, register with any email and any password.
        </p>
        <p style={{ marginTop: "1rem" }}>
          Чтобы посмотреть работу приложения - зарегистрируйтесь с любым email и
          любым паролем.
        </p>
      </div>
    </div>
  );
}
