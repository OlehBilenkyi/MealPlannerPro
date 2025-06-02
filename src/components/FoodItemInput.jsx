import React from "react";

export default function FoodItemInput({
  index,
  food,
  errors,
  onChange,
  onRemove,
  showRemove,
}) {
  return (
    <div className="food-item">
      {/* Название продукта */}
      <label className="form-label">
        Название:
        <input
          className="form-input"
          placeholder="Название"
          value={food.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
        />
        {errors?.name && <div className="form-error">{errors.name}</div>}
      </label>

      {/* Калории */}
      <label className="form-label">
        Калории:
        <input
          className="form-input"
          type="number"
          min="0"
          placeholder="Калории"
          value={food.calories === "" ? "" : food.calories}
          onChange={(e) => {
            const val = e.target.value;
            onChange(index, "calories", val === "" ? "" : Number(val));
          }}
        />
        {errors?.calories && (
          <div className="form-error">{errors.calories}</div>
        )}
      </label>

      {/* Количество */}
      <label className="form-label">
        Количество:
        <input
          className="form-input"
          type="number"
          min="1"
          placeholder="Количество"
          value={food.quantity === "" ? "" : food.quantity}
          onChange={(e) => {
            const val = e.target.value;
            onChange(index, "quantity", val === "" ? "" : Number(val));
          }}
        />
      </label>

      {/* Удалить */}
      {showRemove && (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onRemove(index)}
          style={{ alignSelf: "flex-end", marginTop: "8px" }}
        >
          Удалить
        </button>
      )}
    </div>
  );
}
