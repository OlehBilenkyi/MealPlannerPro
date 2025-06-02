import React from "react";

export default function MealsTable({ meals, onEdit, onDelete }) {
  if (meals.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Нет приёмов, соответствующих фильтрам
      </p>
    );
  }

  return (
    <div className="table-container" style={{ marginTop: "1rem" }}>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Тип</th>
            <th>Калории</th>
            <th>Продукты</th>
            <th>Действия</th>
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
                  Изменить
                </button>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => onDelete(meal.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
