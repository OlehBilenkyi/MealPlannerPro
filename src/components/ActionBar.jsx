import React from "react";
import { useNavigate } from "react-router-dom";

export default function ActionBar({ onClearFilters, onAddMeal }) {
  const navigate = useNavigate();

  return (
    <div className="actions-bar">
      {/* Back */}
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* Clear Filters */}
      <button className="btn btn-warning" onClick={onClearFilters}>
        Clear Filters
      </button>

      {/* Add Meal */}
      <button className="btn btn-primary" onClick={onAddMeal}>
        + Add Meal
      </button>
    </div>
  );
}
