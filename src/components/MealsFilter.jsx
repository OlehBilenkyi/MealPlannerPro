import React from "react";

export default function MealsFilter({ filters, onFilterChange, onClear }) {
  return (
    <div className="filters">
      <h4 className="filter-heading">Фильтры</h4>

      <label className="form-label">
        Тип приёма:
        <select
          className="form-select"
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
        >
          <option value="">Все типы</option>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="snack">snack</option>
        </select>
      </label>

      <label className="form-label">
        Дата:
        <input
          className="form-input"
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange("date", e.target.value)}
        />
      </label>

      <button className="btn btn-primary" onClick={onClear}>
        Сбросить фильтры
      </button>
    </div>
  );
}
