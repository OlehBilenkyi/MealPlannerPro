import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">Meal Planner Pro</div>

      {user && (
        <div className="nav-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/meals"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Мои приёмы
          </NavLink>

          <NavLink
            to="/meals/new"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Добавить приём
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Статистика
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Профиль
          </NavLink>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            Выйти
          </a>
        </div>
      )}
    </nav>
  );
}
