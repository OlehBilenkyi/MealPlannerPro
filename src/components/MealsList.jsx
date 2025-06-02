// src/components/MealsList.jsx
import React from "react";
import MealCard from "./MealCard";

export default function MealsList({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return <p>Нет данных по приёмам пищи</p>;
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
