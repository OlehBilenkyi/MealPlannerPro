import React from "react";
import MealCard from "./MealCard";
import "./MealsList.css";

export default function MealsList({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return <p className="no-meals-message">No meal data available</p>;
  }

  return (
    <div className="meals-list">
      {meals.map((meal, index) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onEdit={onEdit}
          onDelete={onDelete}
          style={{ animationDelay: `${0.1 * ((index % 5) + 1)}s` }}
        />
      ))}
    </div>
  );
}
