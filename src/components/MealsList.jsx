import React from "react";
import MealCard from "./MealCard";

export default function MealsList({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return <p>No meal data available</p>;
  }

  return (
    <>
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
