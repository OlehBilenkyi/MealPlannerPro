import React from "react";
import { useNavigate } from "react-router-dom";

export default function ActionBar({ onClearFilters, onAddMeal }) {
  const navigate = useNavigate();

  return (
    <div className="actions-bar">
      {/* Назад */}
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/dashboard")}
      >
        ← Назад на Dashboard
      </button>

      {/* Сбросить фильтры */}
      <button className="btn btn-warning" onClick={onClearFilters}>
        Сбросить фильтры
      </button>

      {/* Добавить приём */}
      <button className="btn btn-primary" onClick={onAddMeal}>
        + Добавить приём
      </button>
    </div>
  );
}
