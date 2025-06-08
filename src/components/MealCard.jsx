import React from "react";

export default function MealCard({ meal, onEdit, onDelete }) {
  return (
    <div className="meal-card">
      <h3>
        {meal.type} - {meal.date}
      </h3>
      <p>Total Calories: {meal.totalCalories}</p>
      <ul className="meal-list">
        {meal.foods.map((food, idx) => (
          <li key={idx}>
            {food.name} - {food.calories} kcal × {food.quantity}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={() => onEdit(meal)}>
        Edit
      </button>
      <button className="btn btn-danger" onClick={() => onDelete(meal.id)}>
        Delete
      </button>
    </div>
  );
}
