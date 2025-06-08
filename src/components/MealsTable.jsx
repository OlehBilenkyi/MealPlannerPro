import React from "react";

export default function MealsTable({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        No meals match the filters
      </p>
    );
  }

  return (
    <div className="table-container" style={{ marginTop: "1rem" }}>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Calories</th>
            <th>Foods</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal.id}>
              <td>{meal.date}</td>
              <td>{meal.type}</td>
              <td>{meal.totalCalories}</td>
              <td>
                {meal.foods.map((f, idx) => (
                  <div key={idx}>
                    {f.name} × {f.quantity}
                  </div>
                ))}
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  style={{ marginRight: "0.5rem", fontSize: "0.85rem" }}
                  onClick={() => onEdit(meal)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => onDelete(meal.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
