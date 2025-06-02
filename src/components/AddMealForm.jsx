import { useState, useCallback } from "react";
import { mealTypes } from "../services/mealService";
import styles from "./AddMealForm.module.css";

/**
 * @typedef {Object} FoodItem
 * @property {string} name
 * @property {number} calories
 * @property {number} quantity
 */

/** @type {FoodItem} */
const initialFoodItem = { name: "", calories: 0, quantity: 1 };

/**
 * Инициализация состояния приёма пищи
 * @param {Object} meal
 * @returns {{type:string, foods: FoodItem[], date: string}}
 */
const getInitialMealState = (meal) => ({
  type: meal?.type || "breakfast",
  foods: meal?.foods || [initialFoodItem],
  date: meal?.date || new Date().toISOString().slice(0, 10),
});

/**
 * @param {{
 *   index: number,
 *   food: FoodItem,
 *   errors: { name: string, calories: string },
 *   onChange: (index: number, field: string, value: any) => void,
 *   onRemove: (index: number) => void,
 *   showRemove: boolean
 * }} props
 */
function FoodItemInput({ index, food, errors, onChange, onRemove, showRemove }) {
  return (
    <div className={styles.foodItem}>
      <div className={styles.foodItemRow}>
        <input
          className={styles.foodInput}
          placeholder="Название"
          value={food.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
        />
        {errors?.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.foodItemRow}>
        <input
          className={styles.foodInput}
          type="number"
          placeholder="Калории"
          value={food.calories}
          onChange={(e) => onChange(index, "calories", e.target.value)}
        />
        {errors?.calories && (
          <span className={styles.error}>{errors.calories}</span>
        )}
      </div>

      <div className={styles.foodItemRow}>
        <input
          className={styles.foodInput}
          type="number"
          placeholder="Количество"
          value={food.quantity}
          onChange={(e) => onChange(index, "quantity", e.target.value)}
        />
        {showRemove && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(index)}
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}

export default function AddMealForm({ onAdd, meal, onUpdate }) {
  const [newMeal, setNewMeal] = useState(getInitialMealState(meal));
  const [errors, setErrors] = useState({ date: "", foods: [] });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewMeal((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFoodChange = useCallback((index, field, value) => {
    setNewMeal((prev) => {
      const updatedFoods = [...prev.foods];
      updatedFoods[index] = {
        ...updatedFoods[index],
        [field]:
          field === "calories" || field === "quantity" ? Number(value) : value,
      };
      return { ...prev, foods: updatedFoods };
    });
  }, []);

  const addFood = useCallback(() => {
    setNewMeal((prev) => ({
      ...prev,
      foods: [...prev.foods, { ...initialFoodItem }],
    }));
  }, []);

  const removeFood = useCallback((indexToRemove) => {
    setNewMeal((prev) => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== indexToRemove),
    }));
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { date: "", foods: [] };

    if (!newMeal.date) {
      newErrors.date = "Укажите дату";
      isValid = false;
    }

    newMeal.foods.forEach((food, i) => {
      const foodErrors = { name: "", calories: "" };

      if (!food.name.trim()) {
        foodErrors.name = "Введите название";
        isValid = false;
      }
      if (food.calories <= 0) {
        foodErrors.calories = "Калории должны быть > 0";
        isValid = false;
      }

      newErrors.foods[i] = foodErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    meal ? onUpdate(newMeal) : onAdd(newMeal);
    setNewMeal(getInitialMealState());
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.heading}>
        {meal ? "Редактировать приём пищи" : "Добавить приём пищи"}
      </h3>

      <div>
        <label className={styles.label}>
          Дата:
          <input
            className={styles.input}
            type="date"
            name="date"
            value={newMeal.date}
            onChange={handleInputChange}
          />
          {errors.date && <span className={styles.error}>{errors.date}</span>}
        </label>
      </div>

      <div>
        <label className={styles.label}>
          Тип:
          <select
            className={styles.select}
            name="type"
            value={newMeal.type}
            onChange={handleInputChange}
          >
            {mealTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      {newMeal.foods.map((food, index) => (
        <FoodItemInput
          key={index}
          index={index}
          food={food}
          errors={errors.foods[index]}
          onChange={handleFoodChange}
          onRemove={removeFood}
          showRemove={newMeal.foods.length > 1}
        />
      ))}

      <button
        type="button"
        className={styles.button}
        onClick={addFood}
      >
        + Добавить продукт
      </button>

      <button
        type="submit"
        className={`${styles.button} ${styles.submitButton}`}
      >
        {meal ? "Обновить приём пищи" : "Сохранить приём пищи"}
      </button>
    </form>
  );
}
