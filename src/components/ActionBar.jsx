import React, { useState, useCallback, useEffect } from "react";
import { mealTypes } from "../services/mealService";
import FoodItemInput from "./FoodItemInput";

const initialFoodItem = { name: "", calories: "", quantity: "" };

const getInitialMealState = (meal) => ({
  type: meal?.type || "breakfast",
  foods: meal?.foods
    ? meal.foods.map((f) => ({
        name: f.name,
        calories: f.calories,
        quantity: f.quantity,
      }))
    : [{ ...initialFoodItem }],
  date: meal?.date || new Date().toISOString().slice(0, 10),
});

export default function AddMealForm({ onAdd, meal, onUpdate }) {
  const [formState, setFormState] = useState(getInitialMealState(meal));
  const [errors, setErrors] = useState({ date: "", foods: [] });

  useEffect(() => {
    setFormState(getInitialMealState(meal));
    setErrors({ date: "", foods: [] });
  }, [meal]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFoodChange = useCallback((index, field, value) => {
    setFormState((prev) => {
      const updatedFoods = [...prev.foods];
      updatedFoods[index] = {
        ...updatedFoods[index],
        [field]: value,
      };
      return { ...prev, foods: updatedFoods };
    });
  }, []);

  const addFoodItem = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      foods: [...prev.foods, { ...initialFoodItem }],
    }));
    setErrors((prev) => ({
      ...prev,
      foods: [...prev.foods, { name: "", calories: "" }],
    }));
  }, []);

  const removeFoodItem = useCallback((indexToRemove) => {
    setFormState((prev) => ({
      ...prev,
      foods: prev.foods.filter((_, idx) => idx !== indexToRemove),
    }));
    setErrors((prev) => {
      const newFoodsErr = prev.foods.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, foods: newFoodsErr };
    });
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { date: "", foods: [] };

    if (!formState.date) {
      newErrors.date = "Укажите дату";
      isValid = false;
    }

    formState.foods.forEach((food, i) => {
      const itemErr = { name: "", calories: "" };
      if (!food.name.trim()) {
        itemErr.name = "Введите название";
        isValid = false;
      }
      if (food.calories === "" || Number(food.calories) <= 0) {
        itemErr.calories = "Калории должны быть > 0";
        isValid = false;
      }
      if (food.quantity === "" || Number(food.quantity) <= 0) {
        isValid = false;
      }
      newErrors.foods[i] = itemErr;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const preparedFoods = formState.foods.map((f) => ({
      name: f.name.trim(),
      calories: Number(f.calories),
      quantity: Number(f.quantity),
    }));
    const totalCalories = preparedFoods.reduce(
      (sum, f) => sum + f.calories * f.quantity,
      0
    );
    const payload = {
      date: formState.date,
      type: formState.type,
      foods: preparedFoods,
      totalCalories,
    };

    if (meal) {
      onUpdate(payload);
    } else {
      onAdd(payload);
    }

    setFormState(getInitialMealState(null));
    setErrors({ date: "", foods: [] });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label className="form-label">
          Дата:
          <input
            className="form-input"
            type="date"
            name="date"
            value={formState.date}
            onChange={handleInputChange}
          />
        </label>
        {errors.date && <div className="form-error">{errors.date}</div>}

        <label className="form-label">
          Тип приёма:
          <select
            className="form-select"
            name="type"
            value={formState.type}
            onChange={handleInputChange}
          >
            {mealTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "1rem",
        }}
      >
        {formState.foods.map((food, idx) => (
          <FoodItemInput
            key={idx}
            index={idx}
            food={food}
            errors={errors.foods[idx]}
            onChange={handleFoodChange}
            onRemove={removeFoodItem}
            showRemove={formState.foods.length > 1}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" className="btn btn-primary" onClick={addFoodItem}>
          + Добавить продукт
        </button>
        <button type="submit" className="btn btn-success">
          {meal ? "Обновить приём питания" : "Сохранить приём питания"}
        </button>
      </div>
    </form>
  );
}
