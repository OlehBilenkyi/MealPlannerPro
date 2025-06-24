import React from "react";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";
import "./MealsTable.css";

export default function MealsTable({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <FiPlusCircle size={48} className="empty-icon" />
          <h3>No meals found</h3>
          <p>Try adjusting your filters or add a new meal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meals-table-container">
      <div className="table-responsive">
        <table className="meals-table">
          <thead>
            <tr>
              <th className="date-col">Date</th>
              <th className="type-col">Type</th>
              <th className="calories-col">Calories</th>
              <th className="foods-col">Food Items</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, index) => (
              <tr
                key={meal.id}
                className="meal-row"
                style={{ "--delay": index * 0.05 + "s" }}
              >
                <td className="date-cell">
                  <div className="date-wrapper">
                    <span className="day">
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
                <td className="type-cell">
                  <span className={`meal-type ${meal.type.toLowerCase()}`}>
                    {meal.type}
                  </span>
                </td>
                <td className="calories-cell">
                  <div className="calories-badge">
                    {meal.totalCalories}
                    <span className="unit">kcal</span>
                  </div>
                </td>
                <td className="foods-cell">
                  <div className="food-items">
                    {meal.foods.slice(0, 3).map((food, idx) => (
                      <div key={idx} className="food-item">
                        <span className="food-name">{food.name}</span>
                        <span className="food-quantity">×{food.quantity}</span>
                        {food.calories && (
                          <span className="food-calories">
                            {food.calories}kcal
                          </span>
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
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(meal)}
                      aria-label="Edit meal"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDelete(meal.id)}
                      aria-label="Delete meal"
                    >
                      <FiTrash2 size={16} />
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
