import React, { useState, useCallback, useEffect } from "react";
import { mealTypes } from "../../../services/mealService";
import FoodItemInput from "../../FoodItemInput/FoodItemInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddMealForm.css";

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
      newErrors.date = "Please specify a date";
      isValid = false;
    }

    formState.foods.forEach((food, i) => {
      const itemErr = { name: "", calories: "" };
      if (!food.name.trim()) {
        itemErr.name = "Please enter a name";
        isValid = false;
      }
      if (food.calories === "" || Number(food.calories) <= 0) {
        itemErr.calories = "Calories must be greater than 0";
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
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label className="form-label">
          <span>Date</span>
          <DatePicker
            selected={formState.date ? new Date(formState.date) : null}
            onChange={(date) =>
              setFormState((prev) => ({
                ...prev,
                date: date ? date.toISOString().split("T")[0] : "",
              }))
            }
            dateFormat="MMMM d, yyyy"
            className="form-input"
            placeholderText="Select date"
            calendarClassName="theme-calendar"
            popperClassName="calendar-popper"
          />
        </label>
        {errors.date && <div className="form-error">{errors.date}</div>}

        <label className="form-label">
          <span>Meal Type</span>
          <select
            className="form-select"
            name="type"
            value={formState.type}
            onChange={handleInputChange}
          >
            {mealTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="food-items-container">
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

      <div className="buttons-container">
        <button type="button" className="btn btn-primary" onClick={addFoodItem}>
          + Add Food Item
        </button>
        <button type="submit" className="btn btn-success">
          {meal ? "Update Meal" : "Save Meal"}
        </button>
      </div>
    </form>
  );
}
