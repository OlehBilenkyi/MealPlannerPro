import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./services/firebaseConfig";
import { signOut } from "firebase/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Meals from "./pages/Meals";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  // Слушатель изменения состояния аутентификации
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h1>Meal Planner Pro</h1>

        {user && (
          <div style={{ marginBottom: "20px" }}>
            <p>Вы вошли как: {user.email}</p>
            <button onClick={handleLogout}>Выйти</button>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/meals"
            element={
              <PrivateRoute user={user}>
                <Meals />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
