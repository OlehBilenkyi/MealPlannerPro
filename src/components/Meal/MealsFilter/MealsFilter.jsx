import React from "react";
import { FiFilter, FiCalendar, FiChevronDown, FiX } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MealsFilter.css";

const MealFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const mealTypes = [
    { value: "", label: "All Types" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
  ];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <FiFilter className="filter-icon" />
        <h3>Filter Meals</h3>
        {filters.date || filters.type ? (
          <button className="clear-btn" onClick={onClearFilters}>
            <FiX /> Clear
          </button>
        ) : null}
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <span>Meal Type</span>
          <div className="select-wrapper">
            <select
              value={filters.type}
              onChange={(e) => onFilterChange("type", e.target.value)}
              className="type-select"
            >
              {mealTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="select-arrow" />
          </div>
        </label>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <span>Date</span>
          <div className="date-picker-wrapper">
            <DatePicker
              selected={filters.date ? new Date(filters.date) : null}
              onChange={(date) =>
                onFilterChange(
                  "date",
                  date ? date.toISOString().split("T")[0] : ""
                )
              }
              dateFormat="MMMM d, yyyy"
              placeholderText="Select date"
              className="date-picker-input"
              popperClassName="calendar-popper"
              calendarClassName="theme-calendar"
              isClearable
              clearButtonClassName="date-clear-btn"
            />
            <FiCalendar className="calendar-icon" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default MealFilters;
