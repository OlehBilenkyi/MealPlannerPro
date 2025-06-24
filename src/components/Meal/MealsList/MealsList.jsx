import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import MealCard from "./MealCard";
import "./MealsList.css";

export default function MealsList({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <FiPlusCircle className="empty-icon" />
          <h3>No Meals Yet</h3>
          <p>Start by adding your first meal!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meals-grid">
      {meals.map((meal, index) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onEdit={onEdit}
          onDelete={onDelete}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
}
