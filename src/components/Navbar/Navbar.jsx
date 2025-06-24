import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">Meal Planner Pro</div>

      <div className="nav-links">
        {user ? (
          <>
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
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
