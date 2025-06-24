import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import "./Auth.css";

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
      <div className="form-container">
        <h2 className="heading">Login to Meal Planner Pro</h2>
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
          {error && <p className="error-message">{error}</p>}
        </form>

        <p className="text-center mt-2">
          No account?{" "}
          <Link to="/register" className="link">
            Register
          </Link>
        </p>
        <p className="info-text text-center mt-1">
          To see the app in action, register with any email and any password.
        </p>
        <p className="info-text text-center mt-1">
          Чтобы посмотреть работу приложения - зарегистрируйтесь с любым email и
          любым паролем.
        </p>
      </div>
    </div>
  );
}
