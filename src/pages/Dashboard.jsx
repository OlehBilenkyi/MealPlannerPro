import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

export default function Dashboard({ children }) {
  const { user, logout } = useAuth();
  const [isBtnHovered, setBtnHovered] = useState(false);
  const [isLinkHovered, setLinkHovered] = useState(false);
  const [mealsCount, setMealsCount] = useState(0);
  const [caloriesCount, setCaloriesCount] = useState(0);

  // Здесь можно загрузить статистику, например, из Firebase
  useEffect(() => {
    // fetchMealsStats().then(({ meals, calories }) => {
    //   setMealsCount(meals);
    //   setCaloriesCount(calories);
    // });
    // Пока заглушка:
    setMealsCount(3);
    setCaloriesCount(1200);
  }, []);

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    welcome: { color: "#333", fontSize: "24px", marginBottom: "20px" },
    link: {
      display: "inline-block",
      margin: "10px 10px 10px 0",
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "5px",
      fontSize: "16px",
      transition: "background-color 0.3s",
      cursor: "pointer",
    },
    linkHovered: { backgroundColor: "#0056b3" },
    button: {
      padding: "10px 15px",
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
    buttonHovered: { backgroundColor: "#c82333" },
    stats: { margin: "15px 0", fontSize: "18px", color: "#555" },
    childrenWrapper: { marginTop: "20px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.welcome}>
        👋 Добро пожаловать, {user?.displayName || user?.email}!
      </h2>

      <div style={styles.stats}>
        <p>
          🍽 Приёмов пищи сегодня: <strong>{mealsCount}</strong>
        </p>
        <p>
          🔥 Калории: <strong>{caloriesCount}</strong> / 2000 ккал
        </p>
      </div>

      <div>
        <Link
          to="/meals"
          style={{
            ...styles.link,
            ...(isLinkHovered ? styles.linkHovered : {}),
          }}
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
        >
          🍽 Перейти к приёмам пищи
        </Link>
        <Link
          to="/meals/new"
          style={{
            ...styles.link,
            ...(isLinkHovered ? styles.linkHovered : {}),
          }}
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
        >
          ➕ Добавить приём пищи
        </Link>
        <Link
          to="/profile"
          style={{
            ...styles.link,
            ...(isLinkHovered ? styles.linkHovered : {}),
          }}
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
        >
          ⚙️ Настройки профиля
        </Link>
      </div>

      <button
        onClick={logout}
        style={{
          ...styles.button,
          ...(isBtnHovered ? styles.buttonHovered : {}),
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
      >
        Выйти
      </button>

      <div style={styles.childrenWrapper}>{children}</div>
    </div>
  );
}
