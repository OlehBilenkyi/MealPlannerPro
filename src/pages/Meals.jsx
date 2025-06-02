import { Link } from "react-router-dom";

export default function Meals() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>🥦 Приёмы пищи</h2>
      <p>Тут ты сможешь добавлять, редактировать и отслеживать приёмы пищи.</p>

      <Link to="/dashboard">⬅️ Назад в Dashboard</Link>
    </div>
  );
}
