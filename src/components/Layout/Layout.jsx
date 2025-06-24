import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  const { user, logout, error } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="layout-container">
      {user && (
        <div className="user-info">
          <p className="user-email">{user.email}</p>
          <div className="button-group">
            <button className="button button-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="nav-container">
            <button
              className="button nav-button"
              onClick={() => navigate("/meals")}
            >
              Meals
            </button>
            <button
              className="button nav-button"
              onClick={() => navigate("/stats")}
            >
              Statistics
            </button>
          </div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <main className="main-content">{children}</main>
    </div>
  );
}
