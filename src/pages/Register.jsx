import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password);
    if (!error) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container">
      <div
        className="form-container"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <h2 className="heading" style={{ textAlign: "center" }}>
          Register for Meal Planner Pro
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
            {loading ? "Loading..." : "Register"}
          </button>
          {error && (
            <p style={{ color: "var(--color-danger)", marginTop: "0.5rem" }}>
              {error}
            </p>
          )}
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
