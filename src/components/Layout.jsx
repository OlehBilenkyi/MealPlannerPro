// src/components/Layout.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const { user, logout, error } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {user && (
        <div style={{ marginBottom: "20px" }}>
          <p>Вы вошли как: {user.email}</p>
          <button onClick={handleLogout}>Выйти</button>
          <nav>
            <button onClick={() => navigate("/meals")}>Приёмы пищи</button>
            <button onClick={() => navigate("/stats")}>Статистика</button>
          </nav>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {children}
    </>
  );
}
