import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Meals from "./pages/Meals";
import Stats from "./pages/Stats";

/**
 * Основные маршруты приложения с приватными маршрутами
 * @returns {JSX.Element}
 */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/meals"
        element={
          <PrivateRoute>
            <Meals />
          </PrivateRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <PrivateRoute>
            <Stats />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

/**
 * Главный компонент приложения с контекстом авторизации и роутером
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
          <h1>Meal Planner Pro</h1>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}
