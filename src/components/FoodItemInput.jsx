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
      {/* Product Name */}
      <label className="form-label">
        Name:
        <input
          className="form-input"
          placeholder="Name"
          value={food.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
        />
        {errors?.name && <div className="form-error">{errors.name}</div>}
      </label>

      {/* Calories */}
      <label className="form-label">
        Calories:
        <input
          className="form-input"
          type="number"
          min="0"
          placeholder="Calories"
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

      {/* Quantity */}
      <label className="form-label">
        Quantity:
        <input
          className="form-input"
          type="number"
          min="1"
          placeholder="Quantity"
          value={food.quantity === "" ? "" : food.quantity}
          onChange={(e) => {
            const val = e.target.value;
            onChange(index, "quantity", val === "" ? "" : Number(val));
          }}
        />
      </label>

      {/* Remove */}
      {showRemove && (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onRemove(index)}
          style={{ alignSelf: "flex-end", marginTop: "8px" }}
        >
          Remove
        </button>
      )}
    </div>
  );
}
