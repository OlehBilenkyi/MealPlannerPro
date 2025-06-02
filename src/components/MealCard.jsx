// src/components/MealCard.jsx
import React from "react";

export default function MealCard({ meal, onEdit, onDelete }) {
  return (
    <div className="meal-card">
      <h3>
        {meal.type} - {meal.date}
      </h3>
      <p>Всего калорий: {meal.totalCalories}</p>
      <ul className="meal-list">
        {meal.foods.map((food, idx) => (
          <li key={idx}>
            {food.name} - {food.calories} ккал × {food.quantity}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={() => onEdit(meal)}>
        Редактировать
      </button>
      <button className="btn btn-danger" onClick={() => onDelete(meal.id)}>
        Удалить
      </button>
    </div>
  );
}
