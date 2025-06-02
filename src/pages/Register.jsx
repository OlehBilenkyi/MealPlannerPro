// src/pages/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";


export default function Register() {
  const { register, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    register(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        className="form-control my-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="form-control my-2"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="btn btn-primary">Sign Up</button>
      {error && <p className="text-danger mt-2">{error}</p>}
    </form>
  );
}
