import React from "react";
import "./MealCard.css";

export default function MealCard({ meal, onEdit, onDelete }) {
  return (
    <div className="meal-card">
      <h3>
        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} - {meal.date}
      </h3>
      <span className="calories-badge">{meal.totalCalories} kcal</span>
      <ul className="meal-list">
        {meal.foods.map((food, idx) => (
          <li key={idx}>
            <span className="food-name">{food.name}</span>
            <span className="food-details">
              {food.calories} kcal × {food.quantity}
            </span>
          </li>
        ))}
      </ul>
      <div className="card-actions">
        <button className="btn btn-primary" onClick={() => onEdit(meal)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(meal.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
