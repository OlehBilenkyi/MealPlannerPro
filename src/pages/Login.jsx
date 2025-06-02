import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const { user, login, error, loading } = useAuth();
  const [email, setEmail] = useState("I3eLuy@gmail.com");
  const [password, setPassword] = useState("1qazzaq1");

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "400px",
      margin: "40px auto",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    form: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
    },
    buttonDisabled: {
      backgroundColor: "#cccccc",
      cursor: "not-allowed",
    },
    error: {
      color: "#dc3545",
      textAlign: "center",
      marginTop: "10px",
    },
    footerText: {
      textAlign: "center",
      marginTop: "15px",
      fontSize: "14px",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
      cursor: "pointer",
    },
  };

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Вход в Meal Planner Pro</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Пароль:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button
          type="submit"
          disabled={loading}
          style={
            loading
              ? { ...styles.button, ...styles.buttonDisabled }
              : styles.button
          }
        >
          {loading ? "Вход..." : "Войти"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>

      <p style={styles.footerText}>
        Нет аккаунта?{" "}
        <Link to="/register" style={styles.link}>
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
