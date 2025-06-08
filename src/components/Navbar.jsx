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
            My Meals
          </NavLink>

          <NavLink
            to="/meals/new"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Add Meal
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Statistics
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            Logout
          </a>
        </div>
      )}
    </nav>
  );
}
