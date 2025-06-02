import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Защищённый маршрут — рендерит детей если есть user, иначе редирект на /login
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: 18,
        }}
      >
        Загрузка...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
