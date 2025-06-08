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
          <p>You are logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <nav>
            <button onClick={() => navigate("/meals")}>Meals</button>
            <button onClick={() => navigate("/stats")}>Statistics</button>
          </nav>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {children}
    </>
  );
}
