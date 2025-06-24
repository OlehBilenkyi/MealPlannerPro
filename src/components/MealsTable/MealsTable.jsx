import React from "react";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import "./MealsTable.css";

export default function MealsTable({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return (
      <div className="table-empty-state">
        <div className="empty-content">
          <FiPlusCircle className="empty-icon" />
          <h3>No Meals Found</h3>
          <p>Try adjusting filters or add a new meal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="meals-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Meal Type</th>
              <th>Calories</th>
              <th>Food Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal.id} className="meal-row">
                <td>
                  <div className="date-cell">
                    <span className="weekday">
                      {new Date(meal.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                    <span className="date">
                      {new Date(meal.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`meal-type ${meal.type.toLowerCase()}`}>
                    {meal.type}
                  </span>
                </td>
                <td>
                  <div className="calories-cell">
                    {meal.totalCalories}
                    <span className="unit">kcal</span>
                  </div>
                </td>
                <td>
                  <div className="food-items">
                    {meal.foods.slice(0, 3).map((food, idx) => (
                      <div key={idx} className="food-item">
                        <span className="food-name">{food.name}</span>
                        <span className="quantity">×{food.quantity}</span>
                        {food.calories && (
                          <span className="calories">{food.calories}kcal</span>
                        )}
                      </div>
                    ))}
                    {meal.foods.length > 3 && (
                      <div className="more-items">
                        +{meal.foods.length - 3} more
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(meal)}
                      aria-label="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(meal.id)}
                      aria-label="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
