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
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <h2 className="heading" style={{ textAlign: "center" }}>
          Вход в Meal Planner Pro
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
            Пароль:
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Загрузка…" : "Войти"}
          </button>
          {error && (
            <p style={{ color: "var(--color-danger)", marginTop: "0.5rem" }}>
              {error}
            </p>
          )}
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Нет аккаунта?{" "}
          <Link to="/register" style={{ color: "var(--color-primary)" }}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
