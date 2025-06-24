import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaUtensils, FaCoffee, FaHamburger, FaAppleAlt } from "react-icons/fa";
import "./MealCard.css";

export default function MealCard({ meal, onEdit, onDelete }) {
  const getMealIcon = () => {
    switch (meal.type.toLowerCase()) {
      case "breakfast":
        return <FaCoffee className="meal-icon" />;
      case "lunch":
        return <FaUtensils className="meal-icon" />;
      case "dinner":
        return <FaHamburger className="meal-icon" />;
      case "snack":
        return <FaAppleAlt className="meal-icon" />;
      default:
        return <FaUtensils className="meal-icon" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="meal-card">
      <div className="card-header">
        <div className="meal-type-badge">
          {getMealIcon()}
          <span>{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</span>
        </div>
        <div className="meal-date">{formatDate(meal.date)}</div>
      </div>

      <div className="calories-display">
        <div className="calories-value">
          {meal.totalCalories}
          <span className="calories-unit">kcal</span>
        </div>
        <div className="calories-progress">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min(100, (meal.totalCalories / 2000) * 100)}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="food-items">
        {meal.foods.slice(0, 3).map((food, idx) => (
          <div key={idx} className="food-item">
            <span className="food-name">{food.name}</span>
            <div className="food-details">
              <span className="food-quantity">×{food.quantity}</span>
              {food.calories && (
                <span className="food-calories">{food.calories}kcal</span>
              )}
            </div>
          </div>
        ))}
        {meal.foods.length > 3 && (
          <div className="more-items">+{meal.foods.length - 3} more items</div>
        )}
      </div>

      <div className="card-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(meal)}
          aria-label="Edit meal"
        >
          <FiEdit2 />
          <span>Edit</span>
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(meal.id)}
          aria-label="Delete meal"
        >
          <FiTrash2 />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
