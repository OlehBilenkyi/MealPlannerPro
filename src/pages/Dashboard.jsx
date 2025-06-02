import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h2>👋 Добро пожаловать, {user?.email}</h2>
      <div style={{ margin: "10px 0" }}>
        <Link to="/meals">🍽 Перейти к приёмам пищи</Link>
      </div>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}
