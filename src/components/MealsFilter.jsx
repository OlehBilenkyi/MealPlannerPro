import React from "react";

export default function MealsFilter({ filters, onFilterChange, onClear }) {
  return (
    <div className="filters">
      <h4 className="filter-heading">Filters</h4>

      <label className="form-label">
        Meal Type:
        <select
          className="form-select"
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </label>

      <label className="form-label">
        Date:
        <input
          className="form-input"
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange("date", e.target.value)}
        />
      </label>

      <button className="btn btn-primary" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
}
