import { useState, useCallback } from "react";
import { mealTypes } from "../services/mealService";

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

export default function AddMealForm({ onAdd, meal, onUpdate }) {
  const [newMeal, setNewMeal] = useState(getInitialMealState(meal));
  const [errors, setErrors] = useState({ date: "", foods: [] });

  const styles = {
    form: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      color: "#333",
      fontSize: "24px",
      marginBottom: "20px",
      textAlign: "center",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    select: {
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    foodItem: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
      padding: "10px",
      backgroundColor: "#fff",
      borderRadius: "4px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    foodItemRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "5px",
    },
    foodInput: {
      flex: 1,
      padding: "8px",
      marginRight: "5px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    error: {
      color: "red",
      fontSize: "12px",
      marginTop: "-8px",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "10px",
      marginTop: "10px",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    removeButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      padding: "5px 10px",
      marginLeft: "10px",
    },
    removeButtonHover: {
      backgroundColor: "#c82333",
    },
  };

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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>
        {meal ? "Редактировать приём пищи" : "Добавить приём пищи"}
      </h3>

      <div>
        <label style={styles.label}>
          Дата:
          <input
            style={styles.input}
            type="date"
            name="date"
            value={newMeal.date}
            onChange={handleInputChange}
          />
          {errors.date && <span style={styles.error}>{errors.date}</span>}
        </label>
      </div>

      <div>
        <label style={styles.label}>
          Тип:
          <select
            style={styles.select}
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
        <div key={index} style={styles.foodItem}>
          <div style={styles.foodItemRow}>
            <input
              style={styles.foodInput}
              placeholder="Название"
              value={food.name}
              onChange={(e) => handleFoodChange(index, "name", e.target.value)}
            />
            {errors.foods[index]?.name && (
              <span style={styles.error}>{errors.foods[index].name}</span>
            )}
          </div>

          <div style={styles.foodItemRow}>
            <input
              style={styles.foodInput}
              type="number"
              placeholder="Калории"
              value={food.calories}
              onChange={(e) =>
                handleFoodChange(index, "calories", e.target.value)
              }
            />
            {errors.foods[index]?.calories && (
              <span style={styles.error}>{errors.foods[index].calories}</span>
            )}
          </div>

          <div style={styles.foodItemRow}>
            <input
              style={styles.foodInput}
              type="number"
              placeholder="Количество"
              value={food.quantity}
              onChange={(e) =>
                handleFoodChange(index, "quantity", e.target.value)
              }
            />
            {newMeal.foods.length > 1 && (
              <button
                type="button"
                style={styles.removeButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.removeButtonHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.removeButton.backgroundColor)
                }
                onClick={() => removeFood(index)}
              >
                🗑
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        style={styles.button}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            styles.buttonHover.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            styles.button.backgroundColor)
        }
        onClick={addFood}
      >
        + Добавить продукт
      </button>

      <button
        type="submit"
        style={{ ...styles.button, backgroundColor: "#28a745" }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
      >
        {meal ? "Обновить приём пищи" : "Сохранить приём пищи"}
      </button>
    </form>
  );
}
